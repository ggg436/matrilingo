import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@clerk/nextjs';
import { getCourses, getUserProgress } from '@/db/queries';

// Server-side language mapping to avoid client component imports
const SERVER_LANGUAGE_NAMES: Record<string, string> = {
  "en": "english",
  "ne": "nepali",
  "bh": "bhojpuri",
  "ma": "maithili", 
  "nb": "nepal_bhasa",
  "ta": "tamang",
  "th": "tharu"
};

// Helper function to get target language from course title
const extractTargetLanguage = (courseTitle: string) => {
  // Expected format: "Learn Nepali" or similar
  const parts = courseTitle.split(' ');
  if (parts.length >= 2) {
    return parts[1].toLowerCase();
  }
  return null;
};

export async function GET(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get query parameters
  const url = new URL(request.url);
  const lessonId = url.searchParams.get('lessonId');
  const userLanguageCode = url.searchParams.get('userLanguage') || 'en';
  
  if (!lessonId) {
    return NextResponse.json(
      { error: 'Lesson ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get user's active course to determine target language
    const userProgress = await getUserProgress();
    
    if (!userProgress?.activeCourse) {
      return NextResponse.json(
        { error: 'No active course found' },
        { status: 404 }
      );
    }
    
    // Extract target language from course title
    const targetLanguage = extractTargetLanguage(userProgress.activeCourse.title);
    
    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Could not determine target language from course' },
        { status: 400 }
      );
    }
    
    // Map lesson ID to unit and chapter
    // For simplicity, we're using a fixed mapping here
    // In a real app, you'd query the database to get this mapping
    const unit = 1;
    const chapter = 1;
    
    // Load language-specific content
    const basePath = path.join(process.cwd(), 'questionsfinal');
    const userLanguage = SERVER_LANGUAGE_NAMES[userLanguageCode] || 'english';
    
    // Construct the path to the language file
    const filePath = path.join(
      basePath, 
      targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1), 
      `Unit ${unit}`,
      `Chapter ${chapter}`,
      `learn_${targetLanguage}_for_${userLanguage}_speakers`
    );
    
    // Fallback path if specific language file doesn't exist
    const fallbackPath = path.join(
      basePath, 
      targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1), 
      `Unit ${unit}`,
      `Chapter ${chapter}`,
      `learn_${targetLanguage}_for_english_speakers`
    );
    
    let content;
    
    if (fs.existsSync(filePath)) {
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else if (fs.existsSync(fallbackPath)) {
      content = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
    } else {
      return NextResponse.json(
        { error: `Lesson file not found for ${targetLanguage} in ${userLanguage}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      lessonContent: content,
      targetLanguage,
      userLanguage
    });
    
  } catch (error) {
    console.error('Error loading language lesson:', error);
    return NextResponse.json(
      { error: 'Failed to load lesson content' },
      { status: 500 }
    );
  }
} 
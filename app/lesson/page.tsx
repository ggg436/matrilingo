import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "./quiz";

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

// Helper function to extract target language from course title
const extractTargetLanguage = (courseTitle: string) => {
  // Handle special case for Nepal Bhasa (no "Learn" prefix)
  if (courseTitle === "Nepal Bhasa") {
    return "nepal_bhasa";
  }
  
  // Expected format: "Learn Nepali" or similar
  const parts = courseTitle.split(" ");
  if (parts.length >= 2) {
    // Handle special case for Nepal Bhasa with "Learn" prefix
    if (parts.slice(1).join(" ").toLowerCase() === "nepal bhasa") {
      return "nepal_bhasa";
    }
    return parts[1].toLowerCase();
  }
  return null;
};

// Load language-specific content
const loadLanguageContent = (targetLanguage: string, userLanguage: string, unit = 1, chapter = 1) => {
  const basePath = path.join(process.cwd(), "questionsfinal");
  
  // Normalize target language name for file path
  let normalizedTargetLang = targetLanguage;
  
  // Special case for Nepal Bhasa since filename might differ
  if (targetLanguage.toLowerCase() === "nepal_bhasa" || targetLanguage.toLowerCase() === "nepal bhasa") {
    normalizedTargetLang = "Nepal Bhasa";
  } else {
    // Capitalize first letter of each word
    normalizedTargetLang = targetLanguage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Construct path to the language file
  const filePath = path.join(
    basePath,
    normalizedTargetLang,
    `Unit ${unit}`,
    `Chapter ${chapter}`,
    `learn_${targetLanguage.replace(' ', '_').toLowerCase()}_for_${userLanguage}_speakers`
  );
  
  // Fallback path if specific language file doesn't exist
  const fallbackPath = path.join(
    basePath,
    normalizedTargetLang,
    `Unit ${unit}`,
    `Chapter ${chapter}`,
    `learn_${targetLanguage.replace(' ', '_').toLowerCase()}_for_english_speakers`
  );
  
  try {
    if (fs.existsSync(filePath)) {
      console.log(`Loading language content from: ${filePath}`);
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else if (fs.existsSync(fallbackPath)) {
      console.log(`Loading fallback language content from: ${fallbackPath}`);
      return JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
    } else {
      console.log(`No language file found at ${filePath} or ${fallbackPath}`);
    }
  } catch (error) {
    console.error("Error loading language content:", error);
  }
  
  return null;
};

const LessonPage = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  // Get the language preference from URL parameters
  const lang = (searchParams?.lang as string) || "en";
  const userLanguage = SERVER_LANGUAGE_NAMES[lang] || "english";
  
  // Get lesson data
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [
    lesson,
    userProgress,
    userSubscription,
  ] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }
  
  // Try to load language-specific content if a language preference was specified
  let languageContent = null;
  
  if (userProgress.activeCourse) {
    // Log the course details for debugging
    console.log(`Active course: ${userProgress.activeCourse.title} (ID: ${userProgress.activeCourse.id})`);
    
    const targetLanguage = extractTargetLanguage(userProgress.activeCourse.title);
    console.log(`Extracted target language: ${targetLanguage}`);
    
    if (targetLanguage) {
      languageContent = loadLanguageContent(targetLanguage, userLanguage);
      
      if (languageContent) {
        console.log(`Loaded language content with ${languageContent.questions?.length || 0} questions`);
      }
    }
  }

  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.completed)
    .length / lesson.challenges.length * 100;

  return ( 
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
      languageContent={languageContent}
    />
  );
};
 
export default LessonPage;

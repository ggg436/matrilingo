import { NextResponse } from 'next/server';
import { loadLessonWithUserLanguage } from '@/lib/language-utils';
import { LANGUAGE_NAMES } from '@/components/site-language-context';

type LanguageCode = keyof typeof LANGUAGE_NAMES;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetLanguage = url.searchParams.get('targetLanguage');
  const userLanguage = url.searchParams.get('userLanguage') as LanguageCode || 'en';
  const unit = parseInt(url.searchParams.get('unit') || '1', 10);
  const chapter = parseInt(url.searchParams.get('chapter') || '1', 10);
  
  if (!targetLanguage) {
    return NextResponse.json(
      { error: 'Target language is required' },
      { status: 400 }
    );
  }
  
  try {
    const lessonContent = await loadLessonWithUserLanguage(
      targetLanguage,
      userLanguage,
      unit,
      chapter
    );
    
    return NextResponse.json(lessonContent);
  } catch (error) {
    console.error('Error loading lesson content:', error);
    return NextResponse.json(
      { error: 'Failed to load lesson content' },
      { status: 500 }
    );
  }
} 
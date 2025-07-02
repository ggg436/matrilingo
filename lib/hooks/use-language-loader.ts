"use client";

import { useEffect, useState } from "react";
import { useSiteLanguage } from "@/components/site-language-context";

interface LessonContent {
  lesson_title: string;
  questions: any[];
  [key: string]: any;
}

/**
 * A hook to load the appropriate language file based on user's preference
 * 
 * @param targetLanguage The language being learned
 * @param unit The unit number
 * @param chapter The chapter number
 * @returns The lesson content with the UI in the user's selected language
 */
export function useLanguageLoader(
  targetLanguage: string,
  unit: number = 1,
  chapter: number = 1
) {
  const { siteLang } = useSiteLanguage();
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/language-content?targetLanguage=${targetLanguage}&userLanguage=${siteLang}&unit=${unit}&chapter=${chapter}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        
        const data = await response.json();
        setLessonContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error loading lesson content:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadContent();
  }, [targetLanguage, siteLang, unit, chapter]);
  
  return { lessonContent, isLoading, error };
} 
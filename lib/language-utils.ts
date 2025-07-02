import fs from 'fs';
import path from 'path';
import { LANGUAGE_NAMES } from '@/components/site-language-context';

type LanguageCode = keyof typeof LANGUAGE_NAMES;

/**
 * Loads lesson questions with prompts in the user's preferred language
 * 
 * @param targetLanguage The language being learned (e.g., 'nepali', 'tharu')
 * @param userLanguage The user's preferred language for UI (e.g., 'english', 'nepali')
 * @param unit The unit number
 * @param chapter The chapter number
 * @returns The lesson content with questions in the user's preferred language
 */
export async function loadLessonWithUserLanguage(
  targetLanguage: string,
  userLanguageCode: LanguageCode,
  unit: number = 1,
  chapter: number = 1
) {
  const userLanguage = LANGUAGE_NAMES[userLanguageCode];
  const basePath = path.join(process.cwd(), 'questionsfinal');
  
  // Construct the path to the language file
  const filePath = path.join(
    basePath, 
    targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1), 
    `Unit ${unit}`,
    `Chapter ${chapter}`,
    `learn_${targetLanguage}_for_${userLanguage}_speakers`
  );
  
  try {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } else {
      // Fallback to English if the specific language file doesn't exist
      const fallbackPath = path.join(
        basePath, 
        targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1), 
        `Unit ${unit}`,
        `Chapter ${chapter}`,
        `learn_${targetLanguage}_for_english_speakers`
      );
      
      if (fs.existsSync(fallbackPath)) {
        const content = fs.readFileSync(fallbackPath, 'utf-8');
        return JSON.parse(content);
      } else {
        throw new Error(`Lesson file not found for ${targetLanguage} in ${userLanguage}`);
      }
    }
  } catch (error) {
    console.error('Error loading lesson:', error);
    throw error;
  }
}

/**
 * List available languages that can be learned in the user's preferred language
 * 
 * @param userLanguageCode The user's preferred language code
 * @returns Array of available target languages
 */
export async function getAvailableLanguages(userLanguageCode: LanguageCode) {
  const userLanguage = LANGUAGE_NAMES[userLanguageCode];
  const basePath = path.join(process.cwd(), 'questionsfinal');
  const availableLanguages: string[] = [];
  
  // Check each language directory
  try {
    const languageDirs = fs.readdirSync(basePath);
    
    for (const dir of languageDirs) {
      const languageName = dir.toLowerCase();
      const testPath = path.join(
        basePath, 
        dir,
        'Unit 1',
        'Chapter 1',
        `learn_${languageName}_for_${userLanguage}_speakers`
      );
      
      const fallbackPath = path.join(
        basePath, 
        dir,
        'Unit 1',
        'Chapter 1',
        `learn_${languageName}_for_english_speakers`
      );
      
      if (fs.existsSync(testPath) || fs.existsSync(fallbackPath)) {
        availableLanguages.push(languageName);
      }
    }
    
    return availableLanguages;
  } catch (error) {
    console.error('Error getting available languages:', error);
    return [];
  }
} 
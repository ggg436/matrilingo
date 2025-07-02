"use client";

import { useState } from "react";
import { useSiteLanguage, LANGUAGE_NAMES } from "./site-language-context";
import { useLanguageLoader } from "@/lib/hooks/use-language-loader";

export const LanguageExample = () => {
  const { siteLang } = useSiteLanguage();
  const [targetLanguage, setTargetLanguage] = useState("nepali");
  
  const { lessonContent, isLoading, error } = useLanguageLoader(targetLanguage);
  
  // Get the first question from the lesson
  const firstQuestion = lessonContent?.questions?.[0];
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold mb-4">Language Selection Example</h3>
      
      <div className="mb-4">
        <label htmlFor="target-language" className="font-medium text-sm block mb-2">
          Select language to learn:
        </label>
        <select 
          id="target-language"
          value={targetLanguage}
          onChange={e => setTargetLanguage(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
            <option key={code} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
          ))}
        </select>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">
          UI Language: <span className="font-medium">{LANGUAGE_NAMES[siteLang as keyof typeof LANGUAGE_NAMES].charAt(0).toUpperCase() + LANGUAGE_NAMES[siteLang as keyof typeof LANGUAGE_NAMES].slice(1)}</span>
        </p>
        <p className="text-sm text-gray-500">
          Learning: <span className="font-medium">{targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)}</span>
        </p>
      </div>
      
      {isLoading && (
        <div className="text-center py-8">
          <p>Loading lesson content...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
      
      {!isLoading && !error && firstQuestion && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold mb-2">Sample Question:</h4>
          <p className="mb-4">{firstQuestion.prompt_english || firstQuestion[`prompt_${LANGUAGE_NAMES[siteLang as keyof typeof LANGUAGE_NAMES]}`]}</p>
          
          {firstQuestion.question_type === "multiple_choice" && (
            <div className="space-y-2">
              {firstQuestion.languages[targetLanguage].options.map((option: string, index: number) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="radio" 
                    name="option" 
                    id={`option-${index}`} 
                    className="mr-2"
                  />
                  <label htmlFor={`option-${index}`}>{option}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
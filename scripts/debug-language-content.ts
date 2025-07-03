import "dotenv/config";
import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, asc } from "drizzle-orm";

import * as schema from "../db/schema";

try {
  console.log("Starting debug script...");
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not defined");
    process.exit(1);
  }
  
  console.log("Connecting to database...");
  const sql = neon(process.env.DATABASE_URL!);
  // @ts-ignore
  const db = drizzle(sql, { schema });
  
  // Helper function similar to the one in app/lesson/page.tsx
  const extractTargetLanguage = (courseTitle: string) => {
    console.log(`Extracting target language from: "${courseTitle}"`);
    
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
    console.log(`Loading language content for ${targetLanguage} (user language: ${userLanguage})...`);
    
    const basePath = path.join(process.cwd(), "questionsfinal");
    console.log(`Base path: ${basePath}`);
    
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
    
    console.log(`Normalized target language: ${normalizedTargetLang}`);
    
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
    
    console.log("Checking file paths:");
    console.log(`- Primary path: ${filePath}`);
    console.log(`- Fallback path: ${fallbackPath}`);
    
    try {
      if (fs.existsSync(filePath)) {
        console.log(`File found: ${filePath}`);
        const content = fs.readFileSync(filePath, "utf-8");
        console.log(`File size: ${content.length} bytes`);
        return JSON.parse(content);
      } else if (fs.existsSync(fallbackPath)) {
        console.log(`Fallback file found: ${fallbackPath}`);
        const content = fs.readFileSync(fallbackPath, "utf-8");
        console.log(`File size: ${content.length} bytes`);
        return JSON.parse(content);
      } else {
        console.log(`No language file found at either path`);
      }
    } catch (error) {
      console.error("Error loading language content:", error);
    }
    
    return null;
  };
  
  const main = async () => {
    try {
      console.log("Debugging language content loading...");
      
      // 1. Get the Nepal Bhasa course
      const nepalBhasaCourse = await db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.title, "Nepal Bhasa")
      });
      
      if (!nepalBhasaCourse) {
        console.error("Nepal Bhasa course not found in the database");
        return;
      }
      
      console.log(`Found Nepal Bhasa course: ${nepalBhasaCourse.title} (ID: ${nepalBhasaCourse.id})`);
      
      // 2. Extract target language
      const targetLanguage = extractTargetLanguage(nepalBhasaCourse.title);
      console.log(`Extracted target language: ${targetLanguage}`);
      
      // 3. Try to load language content for different user languages
      const userLanguages = ["nepali", "english"];
      
      for (const userLanguage of userLanguages) {
        console.log(`\nTrying to load content for ${userLanguage} speakers:`);
        const content = loadLanguageContent(targetLanguage!, userLanguage);
        
        if (content) {
          console.log(`Successfully loaded content with ${content.questions.length} questions`);
          console.log(`Lesson title: ${content.lesson_title}`);
          console.log(`First 3 questions:`);
          
          for (let i = 0; i < Math.min(3, content.questions.length); i++) {
            const q = content.questions[i];
            console.log(`- Question ${i+1}: ${q.prompt_nepali?.substring(0, 30)}...`);
          }
        } else {
          console.log(`Failed to load content for ${userLanguage} speakers`);
        }
      }
      
      // 4. Check database questions
      console.log("\nChecking database questions:");
      
      // Find Unit 1
      const unit = await db.query.units.findFirst({
        where: (units, { eq, and }) => and(
          eq(units.courseId, nepalBhasaCourse.id),
          eq(units.title, "Unit 1")
        )
      });
      
      if (!unit) {
        console.error("Unit 1 not found for Nepal Bhasa course");
        return;
      }
      
      console.log(`Found Unit 1: ${unit.title} (ID: ${unit.id})`);
      
      // Find Lesson 1
      const lesson = await db.query.lessons.findFirst({
        where: (lessons, { eq, and }) => and(
          eq(lessons.unitId, unit.id),
          eq(lessons.order, 1)
        )
      });
      
      if (!lesson) {
        console.error("Lesson 1 not found for Unit 1");
        return;
      }
      
      console.log(`Found Lesson 1: ${lesson.title} (ID: ${lesson.id})`);
      
      // Get challenges for the lesson
      const challenges = await db.query.challenges.findMany({
        where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id),
        orderBy: (challenges, { asc }) => [asc(challenges.order)]
      });
      
      console.log(`Found ${challenges.length} challenges in the database`);
      
      // Display the first 3 challenges
      for (let i = 0; i < Math.min(3, challenges.length); i++) {
        const challenge = challenges[i];
        console.log(`- Challenge ${i+1}: ${challenge.question}`);
        
        // Get options if it's a SELECT type
        if (challenge.type === "SELECT") {
          const options = await db.query.challengeOptions.findMany({
            where: (options, { eq }) => eq(options.challengeId, challenge.id)
          });
          
          console.log(`  Options: ${options.map(o => o.text).join(", ")}`);
        }
      }
      
      console.log("\nDebug script completed successfully");
    } catch (error) {
      console.error("Error in main function:", error);
    }
  };
  
  main().catch(err => {
    console.error("Unhandled error in main:", err);
    process.exit(1);
  });
} catch (error) {
  console.error("Unhandled script error:", error);
  process.exit(1);
} 
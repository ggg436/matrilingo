import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { eq, and } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

interface LanguageConfig {
  name: string;
  code: string;
  imageSrc: string;
  unitTitle: string;
  unitDescription: string;
}

const addLanguageCourse = async (config: LanguageConfig) => {
  try {
    console.log(`Adding ${config.name} course to database`);

    // Check if course already exists
    const existingCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, config.name)
    });

    let course;
    if (existingCourse) {
      console.log(`${config.name} course already exists with ID: ${existingCourse.id}`);
      course = existingCourse;
    } else {
      // Insert course
      const [newCourse] = await db.insert(schema.courses).values({
        title: config.name,
        imageSrc: config.imageSrc,
      }).returning();
      
      course = newCourse;
      console.log(`Created ${config.name} course with ID: ${course.id}`);
    }

    // Check if Unit 1 exists for the course
    const existingUnit = await db.query.units.findFirst({
      where: (units, { eq, and }) => and(
        eq(units.courseId, course.id),
        eq(units.title, "Unit 1")
      )
    });

    let unit1;
    if (existingUnit) {
      console.log(`Unit 1 already exists for ${config.name} with ID: ${existingUnit.id}`);
      unit1 = existingUnit;
    } else {
      // Add Unit 1
      const [newUnit] = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 1",
        description: config.unitDescription, // Greetings and Basic Phrases
        order: 1,
      }).returning();
      
      unit1 = newUnit;
      console.log(`Created Unit 1 with ID: ${unit1.id}`);
    }

    // Check if Lesson 1 exists for Unit 1
    const existingLesson = await db.query.lessons.findFirst({
      where: (lessons, { eq, and }) => and(
        eq(lessons.unitId, unit1.id),
        eq(lessons.order, 1)
      )
    });

    let lesson;
    if (existingLesson) {
      console.log(`Lesson 1 already exists for Unit 1 with ID: ${existingLesson.id}`);
      lesson = existingLesson;
    } else {
      // Add Chapter 1 lesson
      const [newLesson] = await db.insert(schema.lessons).values({
        unitId: unit1.id,
        order: 1,
        title: config.unitDescription, // Greetings and Basic Phrases
      }).returning();
      
      lesson = newLesson;
      console.log(`Created Lesson 1 with ID: ${lesson.id}`);
    }

    // Load questions from the file
    const filePath = path.join(process.cwd(), "questionsfinal", config.name, "Unit 1", "Chapter 1", `learn_${config.code}_for_nepali_speakers`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    
    // Delete existing challenges for this lesson to avoid duplicates
    await db.delete(schema.challenges).where(
      eq(schema.challenges.lessonId, lesson.id)
    );
    
    console.log(`Deleted existing challenges for Lesson ID: ${lesson.id}`);
    console.log(`Adding ${data.questions.length} questions from file...`);

    // Add each question from the file
    for (let i = 0; i < data.questions.length; i++) {
      const question = data.questions[i];
      let questionType: "SELECT" | "ASSIST" = "SELECT"; // Default type
      
      switch(question.question_type) {
        case "multiple_choice":
        case "multiple_choice_image":
        case "select_the_word":
          questionType = "SELECT";
          break;
        case "translation_input":
        case "construct_the_phrase":
        case "listening_exercise":
        case "fill_in_the_blanks":
        case "true_or_false":
          questionType = "ASSIST";
          break;
      }
      
      // Insert the challenge
      const [challenge] = await db.insert(schema.challenges).values({
        lessonId: lesson.id,
        type: questionType,
        order: i + 1,
        question: question.prompt_nepali,
      }).returning();
      
      console.log(`Added question ${i + 1}: ${question.prompt_nepali.substring(0, 30)}...`);
      
      // Add options for multiple choice questions
      if (question.question_type === "multiple_choice" || 
          question.question_type === "multiple_choice_image" || 
          question.question_type === "select_the_word") {
        
        const options = question.languages[config.code].options;
        const answer = question.languages[config.code].answer;
        
        for (const option of options) {
          let text = option;
          let imageSrc = null;
          
          // Handle image options
          if (typeof option === "object" && option.text) {
            text = option.text;
            imageSrc = option.image || null;
          }
          
          await db.insert(schema.challengeOptions).values({
            challengeId: challenge.id,
            text: text,
            correct: text === answer,
            imageSrc: imageSrc,
          });
        }
        
        console.log(`  Added ${options.length} options for question ${i + 1}`);
      }
    }

    console.log(`${config.name} course and questions added successfully`);
    return course.id;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to add ${config.name} course`);
  }
};

// Main function to add all language courses
const main = async () => {
  try {
    console.log("Adding all language courses to the database");
    
    // Define language configurations
    const languages: LanguageConfig[] = [
      { 
        name: "Nepali", 
        code: "nepali", 
        imageSrc: "/nepali.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      },
      { 
        name: "Bhojpuri", 
        code: "bhojpuri", 
        imageSrc: "/bhojpuri.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      },
      { 
        name: "Tamang", 
        code: "tamang", 
        imageSrc: "/tamang.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      },
      { 
        name: "Maithili", 
        code: "maithili", 
        imageSrc: "/maithili.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      },
      { 
        name: "Tharu", 
        code: "tharu", 
        imageSrc: "/tharu.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      },
      { 
        name: "Nepal Bhasa", 
        code: "nepal_bhasa", 
        imageSrc: "/nepal_bhasa.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      },
      { 
        name: "English", 
        code: "english", 
        imageSrc: "/english.svg", 
        unitTitle: "Unit 1", 
        unitDescription: "अभिवादन र आधारभूत वाक्यहरू" 
      }
    ];
    
    // Add each language course
    for (const language of languages) {
      await addLanguageCourse(language);
    }
    
    console.log("All language courses added successfully");
  } catch (error) {
    console.error("Error adding language courses:", error);
    throw new Error("Failed to add language courses");
  }
};

// Execute if this script is run directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { addLanguageCourse };
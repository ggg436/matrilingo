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

const main = async () => {
  try {
    console.log("Adding Maithili course to database");

    // Check if Maithili course already exists
    const existingCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Maithili")
    });

    let maithiliCourse;
    if (existingCourse) {
      console.log(`Maithili course already exists with ID: ${existingCourse.id}`);
      maithiliCourse = existingCourse;
    } else {
      // Insert Maithili course
      const [newCourse] = await db.insert(schema.courses).values({
        title: "Maithili",
        imageSrc: "/maithili.svg",
      }).returning();
      
      maithiliCourse = newCourse;
      console.log(`Created Maithili course with ID: ${maithiliCourse.id}`);
    }

    // Check if Unit 1 exists for Maithili
    const existingUnit = await db.query.units.findFirst({
      where: (units, { eq, and }) => and(
        eq(units.courseId, maithiliCourse.id),
        eq(units.title, "Unit 1")
      )
    });

    let unit1;
    if (existingUnit) {
      console.log(`Unit 1 already exists for Maithili with ID: ${existingUnit.id}`);
      unit1 = existingUnit;
    } else {
      // Add Unit 1
      const [newUnit] = await db.insert(schema.units).values({
        courseId: maithiliCourse.id,
        title: "Unit 1",
        description: "अभिवादन र आधारभूत वाक्यहरू", // Greetings and Basic Phrases
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

    let greetingsLesson;
    if (existingLesson) {
      console.log(`Lesson 1 already exists for Unit 1 with ID: ${existingLesson.id}`);
      greetingsLesson = existingLesson;
    } else {
      // Add Chapter 1 lesson
      const [newLesson] = await db.insert(schema.lessons).values({
        unitId: unit1.id,
        order: 1,
        title: "अभिवादन र आधारभूत वाक्यहरू", // Greetings and Basic Phrases
      }).returning();
      
      greetingsLesson = newLesson;
      console.log(`Created Lesson 1 with ID: ${greetingsLesson.id}`);
    }

    // Load questions from the file
    const filePath = path.join(process.cwd(), "questionsfinal", "Maithili", "Unit 1", "Chapter 1", "learn_maithili_for_nepali_speakers");
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    
    // Delete existing challenges for this lesson to avoid duplicates
    await db.delete(schema.challenges).where(
      eq(schema.challenges.lessonId, greetingsLesson.id)
    );
    
    console.log(`Deleted existing challenges for Lesson ID: ${greetingsLesson.id}`);
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
        lessonId: greetingsLesson.id,
        type: questionType,
        order: i + 1,
        question: question.prompt_nepali,
      }).returning();
      
      console.log(`Added question ${i + 1}: ${question.prompt_nepali.substring(0, 30)}...`);
      
      // Add options for multiple choice questions
      if (question.question_type === "multiple_choice" || 
          question.question_type === "multiple_choice_image" || 
          question.question_type === "select_the_word") {
        
        const options = question.languages.maithili.options;
        const answer = question.languages.maithili.answer;
        
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

    console.log("Maithili course and questions added successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Maithili course");
  }
};

main(); 
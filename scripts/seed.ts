import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    await db.insert(schema.courses).values([
      {
        title: "Nepali",
        imageSrc: "/es.svg",
      },
      {
        title: "Sanskrit",
        imageSrc: "/it.svg",
      },
      {
        title: "Bhojpuri",
        imageSrc: "/fr.svg",
      },
      {
        title: "Maithili",
        imageSrc: "/hr.svg",
      },
    ]);

    // Add real unit for Nepali with 6 lessons (first lesson is 'Greetings and Basic Phrases')
    const [nepaliCourse] = await db.query.courses.findMany({ where: (courses, { eq }) => eq(courses.title, "Nepali") });
    const [greetingsUnit] = await db.insert(schema.units).values({
      courseId: nepaliCourse.id,
      title: "Unit 1",
      description: "Greetings and Basic Phrases",
      order: 1,
    }).returning();
    // Add 6 lessons, first is 'Greetings and Basic Phrases', rest are placeholders
    const [greetingsLesson] = await db.insert(schema.lessons).values({
      unitId: greetingsUnit.id,
      order: 1,
      title: "Greetings and Basic Phrases",
    }).returning();
    for (let l = 2; l <= 6; l++) {
      await db.insert(schema.lessons).values({
        unitId: greetingsUnit.id,
        order: l,
        title: `Lesson ${l}`,
      });
    }

    // Q1: Which one of these is 'the man'?
    const [q1] = await db.insert(schema.challenges).values({
      lessonId: greetingsLesson.id,
      type: "SELECT",
      order: 1,
      question: "Which one of these is 'the man'?",
    }).returning();
    await db.insert(schema.challengeOptions).values([
      { challengeId: q1.id, imageSrc: "/man.svg", text: "पुरुष", correct: true },
      { challengeId: q1.id, imageSrc: "/woman.svg", text: "महिला", correct: false },
      { challengeId: q1.id, imageSrc: "/robot.svg", text: "रोबोट", correct: false },
    ]);

    // Q2: Which of these is 'Hello'?
    const [q2] = await db.insert(schema.challenges).values({
      lessonId: greetingsLesson.id,
      type: "SELECT",
      order: 2,
      question: "Which of these is 'Hello'?",
    }).returning();
    await db.insert(schema.challengeOptions).values([
      { challengeId: q2.id, text: "नमस्ते", correct: true },
      { challengeId: q2.id, text: "धन्यवाद", correct: false },
      { challengeId: q2.id, text: "फेरि भेटौँला", correct: false },
    ]);

    // Q3: Which of these is 'Thank you'?
    const [q3] = await db.insert(schema.challenges).values({
      lessonId: greetingsLesson.id,
      type: "SELECT",
      order: 3,
      question: "Which of these is 'Thank you'?",
    }).returning();
    await db.insert(schema.challengeOptions).values([
      { challengeId: q3.id, text: "नमस्ते", correct: false },
      { challengeId: q3.id, text: "धन्यवाद", correct: true },
      { challengeId: q3.id, text: "स्वागत छ", correct: false },
    ]);

    // For each course, add 2 demo units, each with 6 lessons (no questions for now)
    const allCourses = await db.query.courses.findMany();
    for (const course of allCourses) {
      for (let u = 1; u <= 2; u++) {
        const [unit] = await db.insert(schema.units).values({
          courseId: course.id,
          title: `Unit ${u}`,
          description: `Demo unit ${u} for ${course.title}`,
          order: u,
        }).returning();
        for (let l = 1; l <= 6; l++) {
          await db.insert(schema.lessons).values({
            unitId: unit.id,
            order: l,
            title: `Lesson ${l}`,
          });
        }
      }
    }

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();


import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Updating Maithili lesson title...");

    // Find Maithili course
    const maithiliCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Maithili")
    });

    if (!maithiliCourse) {
      console.error("Maithili course not found");
      return;
    }
    
    console.log(`Found Maithili course: ${maithiliCourse.title} (ID: ${maithiliCourse.id})`);

    // Find Unit 1
    const unit = await db.query.units.findFirst({
      where: (units, { eq, and }) => and(
        eq(units.courseId, maithiliCourse.id),
        eq(units.title, "Unit 1")
      )
    });

    if (!unit) {
      console.error("Unit 1 not found for Maithili course");
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
    
    // Update lesson title
    const newTitle = "अभिवादन र आधारभूत वाक्यहरू";
    
    await db.update(schema.lessons)
      .set({ title: newTitle })
      .where(eq(schema.lessons.id, lesson.id));
      
    console.log(`Updated lesson title from "${lesson.title}" to "${newTitle}"`);
    
    // Verify update
    const updatedLesson = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.id, lesson.id)
    });
    
    if (updatedLesson) {
      console.log(`Verification: lesson title is now "${updatedLesson.title}"`);
    }
    
  } catch (error) {
    console.error("Error updating lesson title:", error);
    throw new Error("Failed to update lesson title");
  }
};

main(); 
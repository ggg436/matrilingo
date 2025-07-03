import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Restoring original course images");

    // Restore course images to their original values from seed.ts
    await db
      .update(schema.courses)
      .set({ imageSrc: "/es.svg" })
      .where(eq(schema.courses.title, "Nepali"));
    
    await db
      .update(schema.courses)
      .set({ imageSrc: "/it.svg" })
      .where(eq(schema.courses.title, "Sanskrit"));
    
    await db
      .update(schema.courses)
      .set({ imageSrc: "/fr.svg" })
      .where(eq(schema.courses.title, "Bhojpuri"));
    
    await db
      .update(schema.courses)
      .set({ imageSrc: "/hr.svg" })
      .where(eq(schema.courses.title, "Maithili"));
    
    // Also restore newer course images
    await db
      .update(schema.courses)
      .set({ imageSrc: "/fr.svg" })
      .where(eq(schema.courses.title, "Nepal Bhasa"));
    
    await db
      .update(schema.courses)
      .set({ imageSrc: "/it.svg" })
      .where(eq(schema.courses.title, "Tamang"));
    
    await db
      .update(schema.courses)
      .set({ imageSrc: "/hr.svg" })
      .where(eq(schema.courses.title, "English"));
    
    await db
      .update(schema.courses)
      .set({ imageSrc: "/jp.svg" })
      .where(eq(schema.courses.title, "Tharu"));

    console.log("Course images have been restored to their original values");
  } catch (error) {
    console.error("Error restoring course images:", error);
    throw new Error("Failed to restore course images");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 
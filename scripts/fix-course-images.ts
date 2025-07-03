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
    console.log("Fixing course images for Nepal Bhasa and Tamang");

    // Update Nepal Bhasa course to use newari.jpg
    await db
      .update(schema.courses)
      .set({ imageSrc: "/newari.jpg" })
      .where(eq(schema.courses.title, "Nepal Bhasa"));
    console.log("Nepal Bhasa course updated to use newari.jpg");
    
    // Update Tamang course to use tamang.svg
    await db
      .update(schema.courses)
      .set({ imageSrc: "/tamang.svg" })
      .where(eq(schema.courses.title, "Tamang"));
    console.log("Tamang course updated to use tamang.svg");
    
    console.log("Course images fixed successfully");
  } catch (error) {
    console.error("Error fixing course images:", error);
    throw new Error("Failed to fix course images");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 
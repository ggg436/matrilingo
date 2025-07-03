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
    console.log("Updating course images");

    // Update Nepal Bhasa course image
    await db
      .update(schema.courses)
      .set({ imageSrc: "/nepal_bhasa.svg" })
      .where(eq(schema.courses.title, "Nepal Bhasa"));
    
    // Update Maithili course image
    await db
      .update(schema.courses)
      .set({ imageSrc: "/maithili.svg" })
      .where(eq(schema.courses.title, "Maithili"));

    // Update Nepali course image with Nepal's flag
    // Using a Nepal flag or keeping spanish flag based on availability
    await db
      .update(schema.courses)
      .set({ imageSrc: "/es.svg" })  // Using Spanish flag for now
      .where(eq(schema.courses.title, "Nepali"));

    // Update Bhojpuri course image
    await db
      .update(schema.courses)
      .set({ imageSrc: "/fr.svg" })  // Using French flag for now
      .where(eq(schema.courses.title, "Bhojpuri"));

    // Update Tamang course image
    await db
      .update(schema.courses)
      .set({ imageSrc: "/it.svg" })  // Using Italian flag for now
      .where(eq(schema.courses.title, "Tamang"));

    // Update Tharu course image
    await db
      .update(schema.courses)
      .set({ imageSrc: "/jp.svg" })  // Using Japanese flag for now
      .where(eq(schema.courses.title, "Tharu"));

    // Update English course image
    await db
      .update(schema.courses)
      .set({ imageSrc: "/hr.svg" })  // Using Croatian flag for now
      .where(eq(schema.courses.title, "English"));

    console.log("Course images updated successfully");
  } catch (error) {
    console.error("Error updating course images:", error);
    throw new Error("Failed to update course images");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 
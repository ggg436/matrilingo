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
    console.log("Updating language course images");

    // Update Nepal Bhasa (Newari) course to use newari.jpg
    await db
      .update(schema.courses)
      .set({ imageSrc: "/newari.jpg" })
      .where(eq(schema.courses.title, "Nepal Bhasa"));
    
    // Update Tamang course to use the tamang.svg (since tamang.png is empty)
    await db
      .update(schema.courses)
      .set({ imageSrc: "/tamang.svg" })
      .where(eq(schema.courses.title, "Tamang"));
    
    console.log("Language course images updated successfully");
  } catch (error) {
    console.error("Error updating language course images:", error);
    throw new Error("Failed to update language course images");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 
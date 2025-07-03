import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Updating Tamang course image");

    // Create a new tamang SVG file
    const tamangSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <!-- Background shape -->
  <rect width="120" height="120" fill="#6B5B95" rx="10" ry="10" />
  
  <!-- Inner circle for decorative element -->
  <circle cx="60" cy="60" r="40" fill="#563D7C" stroke="#FFFFFF" stroke-width="2" />
  
  <!-- Letter "त" for Tamang -->
  <text x="60" y="68" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle">त</text>
  
  <!-- Text "Tamang" -->
  <text x="60" y="100" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">Tamang</text>
</svg>`;

    // Write the SVG file
    fs.writeFileSync(path.join(process.cwd(), 'public', 'tamang.svg'), tamangSvgContent);

    // Delete the placeholder PNG file if it exists
    const pngPath = path.join(process.cwd(), 'public', 'tamang.png');
    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
      console.log("Deleted placeholder tamang.png file");
    }

    // Update Tamang course to use the SVG
    await db
      .update(schema.courses)
      .set({ imageSrc: "/tamang.svg" })
      .where(eq(schema.courses.title, "Tamang"));
    
    console.log("Tamang course image updated successfully");
  } catch (error) {
    console.error("Error updating Tamang course image:", error);
    throw new Error("Failed to update Tamang course image");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 
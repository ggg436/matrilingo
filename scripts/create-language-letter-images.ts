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

// Function to create SVG content for a language
const createLanguageSvg = (language: string, letter: string, bgColor: string, fgColor: string) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <!-- Background shape -->
  <rect width="120" height="120" fill="${bgColor}" rx="10" ry="10" />
  
  <!-- Inner circle for decorative element -->
  <circle cx="60" cy="60" r="40" fill="${fgColor}" stroke="#FFFFFF" stroke-width="2" />
  
  <!-- Letter for ${language} -->
  <text x="60" y="75" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white" text-anchor="middle">${letter}</text>
  
  <!-- Language name -->
  <text x="60" y="105" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">${language}</text>
</svg>`;
};

const main = async () => {
  try {
    console.log("Creating language letter images and updating database");

    // Define languages with their first letter and colors
    const languages = [
      { name: "Nepali", letter: "न", bgColor: "#D60000", fgColor: "#9B0000" },
      { name: "Nepal Bhasa", letter: "न", bgColor: "#D22830", fgColor: "#9B1C24" },
      { name: "Maithili", letter: "म", bgColor: "#538135", fgColor: "#385723" },
      { name: "Bhojpuri", letter: "भ", bgColor: "#1F4E79", fgColor: "#0F3052" },
      { name: "Tamang", letter: "त", bgColor: "#6B5B95", fgColor: "#4F4370" },
      { name: "Tharu", letter: "थ", bgColor: "#C55A11", fgColor: "#97440C" },
      { name: "English", letter: "E", bgColor: "#1D1D45", fgColor: "#101029" },
    ];

    // Create SVG files and update database
    for (const lang of languages) {
      const fileName = `${lang.name.toLowerCase().replace(/\s+/g, '_')}.svg`;
      const filePath = path.join(process.cwd(), 'public', fileName);
      
      // Create SVG file
      const svgContent = createLanguageSvg(lang.name, lang.letter, lang.bgColor, lang.fgColor);
      fs.writeFileSync(filePath, svgContent);
      console.log(`Created ${fileName}`);

      // Update database
      await db
        .update(schema.courses)
        .set({ imageSrc: `/${fileName}` })
        .where(eq(schema.courses.title, lang.name));
      console.log(`Updated database for ${lang.name}`);
    }

    console.log("Language letter images created and database updated successfully");
  } catch (error) {
    console.error("Error creating language letter images:", error);
    throw new Error("Failed to create language letter images");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 
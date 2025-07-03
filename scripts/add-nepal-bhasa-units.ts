import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

// Unit descriptions for Nepal Bhasa
const unitDescriptions = [
  "अभिवादन र आधारभूत वाक्यहरू", // Unit 1: Greetings and Basic Phrases (already exists)
  "परिवार र सम्बन्धहरू",        // Unit 2: Family and Relationships
  "खाना र पेय पदार्थहरू",       // Unit 3: Food and Beverages
  "यात्रा र परिवहन",           // Unit 4: Travel and Transportation
  "समय र दिनचर्या",            // Unit 5: Time and Daily Routine
  "स्वास्थ्य र शरीर",          // Unit 6: Health and Body
  "शिक्षा र विद्यालय",         // Unit 7: Education and School
  "प्रकृति र वातावरण",         // Unit 8: Nature and Environment
  "संस्कृति र परम्परा",        // Unit 9: Culture and Traditions
  "व्यापार र पेशा"             // Unit 10: Business and Professions
];

// Lesson titles for each unit (6 lessons per unit)
const lessonTitles = [
  [
    "अभिवादन र परिचय",          // Greetings and Introduction
    "आधारभूत शब्दावली",          // Basic Vocabulary
    "साधारण वाक्यहरू",           // Simple Sentences
    "प्रश्न सोध्ने",             // Asking Questions
    "संख्याहरू र गिन्ती",         // Numbers and Counting
    "अभिव्यक्ति र भावनाहरू"       // Expressions and Emotions
  ],
  [
    "परिवारका सदस्यहरू",          // Family Members
    "नातागोता र सम्बन्धहरू",      // Relatives and Relationships
    "परिवारको वर्णन",            // Describing Family
    "घर र घरका सामानहरू",         // Home and Household Items
    "पारिवारिक समारोहहरू",        // Family Celebrations
    "पारिवारिक जिम्मेवारीहरू"      // Family Responsibilities
  ],
  [
    "खानाका प्रकारहरू",           // Types of Food
    "पेय पदार्थहरू",             // Beverages
    "रेस्टुरेन्टमा अर्डर गर्ने",   // Ordering in a Restaurant
    "पकाउने शब्दावली",           // Cooking Vocabulary
    "स्वादहरू र प्राथमिकताहरू",    // Tastes and Preferences
    "नेवारी खानाहरू"              // Newari Cuisine
  ],
  [
    "यातायातका साधनहरू",          // Means of Transportation
    "दिशा र स्थानहरू",           // Directions and Locations
    "टिकट र भाडा",              // Tickets and Fares
    "यात्रा योजना",              // Travel Planning
    "सार्वजनिक यातायात",          // Public Transportation
    "पर्यटकीय स्थलहरू"            // Tourist Places
  ],
  [
    "समय र घडी",                // Time and Clock
    "दिनको समय",                // Times of the Day
    "हप्ताका दिनहरू",            // Days of the Week
    "महिना र ऋतुहरू",            // Months and Seasons
    "दैनिक दिनचर्या",            // Daily Routine
    "योजना र कार्यतालिका"         // Plans and Schedules
  ],
  [
    "शरीरका अंगहरू",             // Body Parts
    "स्वास्थ्य र बिमारी",         // Health and Illness
    "चिकित्सा र उपचार",          // Medical Care and Treatment
    "स्वस्थ जीवनशैली",           // Healthy Lifestyle
    "भावनात्मक स्वास्थ्य",        // Emotional Health
    "औषधि र उपचार"               // Medicine and Remedies
  ],
  [
    "विद्यालय र कक्षाकोठा",       // School and Classroom
    "शिक्षा प्रणाली",            // Education System
    "विषयहरू र अध्ययन",          // Subjects and Studies
    "शैक्षिक सामग्रीहरू",         // Educational Materials
    "परीक्षा र मूल्यांकन",        // Exams and Evaluation
    "शिक्षा र करियर"             // Education and Career
  ],
  [
    "प्रकृति र वनस्पति",          // Nature and Flora
    "जनावर र जीवजन्तु",          // Animals and Wildlife
    "मौसम र जलवायु",            // Weather and Climate
    "वातावरण संरक्षण",           // Environmental Conservation
    "प्राकृतिक स्थानहरू",         // Natural Places
    "प्राकृतिक प्रकोपहरू"         // Natural Disasters
  ],
  [
    "संस्कृति र परम्परा",         // Culture and Traditions
    "चाडपर्व र उत्सवहरू",         // Festivals and Celebrations
    "धार्मिक रीतिरिवाजहरू",       // Religious Customs
    "कला र संगीत",              // Art and Music
    "पोशाक र भेषभूषा",           // Clothing and Attire
    "ऐतिहासिक स्थलहरू"           // Historical Places
  ],
  [
    "व्यापार र व्यवसाय",          // Business and Commerce
    "पेशा र रोजगार",             // Professions and Employment
    "कार्यालय र कार्यस्थल",       // Office and Workplace
    "बजार र खरिदारी",            // Market and Shopping
    "बैंकिङ र वित्त",            // Banking and Finance
    "उद्यमशीलता र नवप्रवर्तन"     // Entrepreneurship and Innovation
  ]
];

const main = async () => {
  try {
    console.log("Adding additional units for Nepal Bhasa course");

    // Get Nepal Bhasa course
    const nepalBhasaCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Nepal Bhasa")
    });

    if (!nepalBhasaCourse) {
      throw new Error("Nepal Bhasa course not found. Please run add-nepal-bhasa-course.ts first.");
    }

    console.log(`Found Nepal Bhasa course with ID: ${nepalBhasaCourse.id}`);

    // Add Units 2-10 with 6 lessons each
    for (let unitOrder = 2; unitOrder <= 10; unitOrder++) {
      // Check if unit already exists
      const existingUnit = await db.query.units.findFirst({
        where: (units, { eq, and }) => and(
          eq(units.courseId, nepalBhasaCourse.id),
          eq(units.order, unitOrder)
        )
      });

      let unit;
      if (existingUnit) {
        console.log(`Unit ${unitOrder} already exists with ID: ${existingUnit.id}`);
        unit = existingUnit;
      } else {
        // Add new unit
        const [newUnit] = await db.insert(schema.units).values({
          courseId: nepalBhasaCourse.id,
          title: `Unit ${unitOrder}`,
          description: unitDescriptions[unitOrder - 1],
          order: unitOrder,
        }).returning();
        
        unit = newUnit;
        console.log(`Created Unit ${unitOrder} with ID: ${unit.id}`);
      }

      // Add 6 lessons for each unit
      for (let lessonOrder = 1; lessonOrder <= 6; lessonOrder++) {
        // Check if lesson already exists
        const existingLesson = await db.query.lessons.findFirst({
          where: (lessons, { eq, and }) => and(
            eq(lessons.unitId, unit.id),
            eq(lessons.order, lessonOrder)
          )
        });

        if (existingLesson) {
          console.log(`Lesson ${lessonOrder} already exists for Unit ${unitOrder} with ID: ${existingLesson.id}`);
        } else {
          // Add new lesson
          const [newLesson] = await db.insert(schema.lessons).values({
            unitId: unit.id,
            order: lessonOrder,
            title: lessonTitles[unitOrder - 1][lessonOrder - 1],
          }).returning();
          
          console.log(`Created Lesson ${lessonOrder} for Unit ${unitOrder} with ID: ${newLesson.id}`);
        }
      }
    }

    console.log("Successfully added all units and lessons for Nepal Bhasa course");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Nepal Bhasa units and lessons");
  }
};

main(); 
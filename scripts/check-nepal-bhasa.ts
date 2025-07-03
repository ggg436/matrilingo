import fs from "fs";
import path from "path";

const main = async () => {
  try {
    console.log("Checking Nepal Bhasa content...");
    
    const basePath = path.join(process.cwd(), "questionsfinal");
    const nepalBhasaPath = path.join(basePath, "Nepal Bhasa", "Unit 1", "Chapter 1");
    
    // Check if directory exists
    if (!fs.existsSync(nepalBhasaPath)) {
      console.error(`Directory not found: ${nepalBhasaPath}`);
      return;
    }
    
    console.log(`Directory found: ${nepalBhasaPath}`);
    
    // List files in directory
    const files = fs.readdirSync(nepalBhasaPath);
    console.log("Files found:", files);
    
    // Check for Nepal Bhasa file
    const filePath = path.join(nepalBhasaPath, "learn_nepal_bhasa_for_nepali_speakers");
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }
    
    console.log(`File found: ${filePath}`);
    
    // Read and parse the file
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    
    console.log("File content:");
    console.log(`- Lesson title: ${data.lesson_title}`);
    console.log(`- Number of questions: ${data.questions.length}`);
    
    // Log the first 3 questions
    for (let i = 0; i < Math.min(3, data.questions.length); i++) {
      const q = data.questions[i];
      console.log(`\nQuestion ${i + 1}:`);
      console.log(`- Type: ${q.question_type}`);
      console.log(`- Topic: ${q.topic}`);
      console.log(`- Prompt: ${q.prompt_nepali}`);
    }
    
    console.log("\nNepal Bhasa content verification completed successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};

main(); 
import "dotenv/config";
import fs from "fs";
import path from "path";
import { mkdirSync } from "fs";

// Helper function to create directory if it doesn't exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Function to create demo questions for a language
const createDemoQuestions = (language: string, languageCode: string, translations: any) => {
  const questionsData = {
    lesson_title: "अभिवादन र आधारभूत वाक्यहरू", // Greetings and Basic Phrases
    questions: [
      {
        concept_id: "people_1",
        topic: "People",
        question_type: "multiple_choice_image",
        prompt_nepali: "यी मध्ये कुन चाहिँ 'पुरुष' हो?",
        media: {},
        languages: {
          [languageCode]: {
            options: [
              { image: "images/man.svg", text: translations.man },
              { image: "images/woman.svg", text: translations.woman },
              { image: "images/robot.svg", text: translations.robot }
            ],
            answer: translations.man
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_1",
        topic: "Greetings and Basic Phrases",
        question_type: "multiple_choice",
        prompt_nepali: "यी मध्ये कुन चाहिँ 'नमस्ते' हो?",
        media: {},
        languages: {
          [languageCode]: {
            options: [ translations.hello, translations.thankyou, translations.goodbye ],
            answer: translations.hello
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_2",
        topic: "Greetings and Basic Phrases",
        question_type: "multiple_choice",
        prompt_nepali: "यी मध्ये कुन चाहिँ 'धन्यवाद' हो?",
        media: {},
        languages: {
          [languageCode]: {
            options: [ translations.hello, translations.thankyou, translations.welcome ],
            answer: translations.thankyou
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_3",
        topic: "Greetings and Basic Phrases",
        question_type: "translation_input",
        prompt_nepali: `यसलाई ${language} भाषामा लेख्नुहोस्`,
        media: {},
        languages: {
          nepali: {
            prompt: "मेरो नाम राम हो"
          },
          [languageCode]: {
            answer: translations.myNameIsRam
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_4",
        topic: "Greetings and Basic Phrases",
        question_type: "select_the_word",
        prompt_nepali: "'बिदा' को लागि शब्द चयन गर्नुहोस्।",
        media: {},
        languages: {
          [languageCode]: {
            options: [translations.hello, translations.thankyou, translations.goodbye, translations.welcome],
            answer: translations.goodbye
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_5",
        topic: "Greetings and Basic Phrases",
        question_type: "construct_the_phrase",
        prompt_nepali: "'तिम्रो नाम के हो?' को लागि वाक्य बनाउनुहोस्।",
        media: {},
        languages: {
          [languageCode]: {
            word_bank: translations.whatIsYourNameWordBank,
            answer: translations.whatIsYourName
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_6",
        topic: "Greetings and Basic Phrases",
        question_type: "multiple_choice",
        prompt_nepali: "'म खुशी छु' को अनुवाद के हो?",
        media: {},
        languages: {
          [languageCode]: {
            options: [ translations.iAmHappy, translations.iAmSad, translations.iAmAngry ],
            answer: translations.iAmHappy
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_7",
        topic: "Greetings and Basic Phrases",
        question_type: "fill_in_the_blanks",
        prompt_nepali: `खाली स्थान भर्नुहोस्: ${translations.fillInBlanksSentence}`,
        media: {},
        languages: {
          [languageCode]: {
            options: translations.fillInBlanksOptions,
            answer: translations.fillInBlanksAnswer
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_8",
        topic: "Greetings and Basic Phrases",
        question_type: "translation_input",
        prompt_nepali: `यसलाई ${language} भाषामा लेख्नुहोस्`,
        media: {},
        languages: {
          nepali: {
            prompt: "शुभ बिहानी"
          },
          [languageCode]: {
            answer: translations.goodMorning
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_9",
        topic: "Greetings and Basic Phrases",
        question_type: "multiple_choice",
        prompt_nepali: "यी मध्ये कुन चाहिँ 'स्वागत छ' हो?",
        media: {},
        languages: {
          [languageCode]: {
            options: [ translations.hello, translations.welcome, translations.goodbye ],
            answer: translations.welcome
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_10",
        topic: "Greetings and Basic Phrases",
        question_type: "construct_the_phrase",
        prompt_nepali: "'म नेपालबाट हुँ' को लागि वाक्य बनाउनुहोस्।",
        media: {},
        languages: {
          [languageCode]: {
            word_bank: translations.iAmFromNepalWordBank,
            answer: translations.iAmFromNepal
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_11",
        topic: "Greetings and Basic Phrases",
        question_type: "true_or_false",
        prompt_nepali: `के '${translations.iDontUnderstand}' को अर्थ 'मैले बुझिन' हो?`,
        media: {},
        languages: {
          nepali: {
            meaning: "मैले बुझिन"
          },
          answer: true,
          [languageCode]: {
            phrase: translations.iDontUnderstand
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_12",
        topic: "Greetings and Basic Phrases",
        question_type: "select_the_word",
        prompt_nepali: "'माफ गर्नुहोस्' को लागि शब्द चयन गर्नुहोस्।",
        media: {},
        languages: {
          [languageCode]: {
            options: [translations.excuseMe, translations.please, translations.sorry, translations.thankyou],
            answer: translations.excuseMe
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_13",
        topic: "Greetings and Basic Phrases",
        question_type: "translation_input",
        prompt_nepali: `यसलाई ${language} भाषामा लेख्नुहोस्`,
        media: {},
        languages: {
          nepali: {
            prompt: "तपाईंको उमेर कति भयो?"
          },
          [languageCode]: {
            answer: translations.howOldAreYou
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_14",
        topic: "Greetings and Basic Phrases",
        question_type: "fill_in_the_blanks",
        prompt_nepali: `खाली स्थान भर्नुहोस्: ${translations.fillInBlanksSentence2}`,
        media: {},
        languages: {
          [languageCode]: {
            options: translations.fillInBlanksOptions2,
            answer: translations.fillInBlanksAnswer2
          }
        }
      },
      {
        concept_id: "greetings_and_basic_phrases_15",
        topic: "Greetings and Basic Phrases",
        question_type: "multiple_choice",
        prompt_nepali: `'${translations.thankyou}' (धन्यवाद) को जवाफ के हो?`,
        media: {},
        languages: {
          [languageCode]: {
            options: [ translations.hello, translations.welcome, translations.goodbye ],
            answer: translations.welcome
          }
        }
      }
    ]
  };

  // Create directory structure
  const basePath = path.join(process.cwd(), "questionsfinal", language);
  const unitPath = path.join(basePath, "Unit 1");
  const chapterPath = path.join(unitPath, "Chapter 1");
  
  ensureDirectoryExists(basePath);
  ensureDirectoryExists(unitPath);
  ensureDirectoryExists(chapterPath);
  
  // Create the file with the questions
  const filePath = path.join(chapterPath, `learn_${languageCode}_for_nepali_speakers`);
  fs.writeFileSync(filePath, JSON.stringify(questionsData, null, 4));
  
  console.log(`Created questions file for ${language} at: ${filePath}`);
  
  return filePath;
};

const main = async () => {
  try {
    console.log("Creating demo questions for all language courses");
    
    // Define language translations for basic phrases
    const languagesData = [
      {
        name: "Nepali",
        code: "nepali",
        translations: {
          man: "पुरुष",
          woman: "महिला",
          robot: "रोबोट",
          hello: "नमस्कार",
          thankyou: "धन्यवाद",
          welcome: "स्वागतम्",
          goodbye: "नमस्ते",
          myNameIsRam: "मेरो नाम राम हो",
          whatIsYourNameWordBank: ["तिम्रो", "नाम", "के", "हो", "?"],
          whatIsYourName: "तिम्रो नाम के हो?",
          iAmHappy: "म खुशी छु",
          iAmSad: "म दुःखी छु",
          iAmAngry: "म रिसाएको छु",
          fillInBlanksSentence: "तपाईंलाई ___ मिल्यो।",
          fillInBlanksOptions: ["भेट्न", "देख्न", "सुन्न"],
          fillInBlanksAnswer: "भेट्न",
          goodMorning: "शुभ प्रभात",
          iAmFromNepalWordBank: ["म", "नेपालबाट", "हुँ", "।"],
          iAmFromNepal: "म नेपालबाट हुँ।",
          iDontUnderstand: "मैले बुझिन",
          excuseMe: "माफ गर्नुहोस्",
          please: "कृपया",
          sorry: "माफी",
          howOldAreYou: "तपाईंको उमेर कति भयो?",
          fillInBlanksSentence2: "नमस्कार, तपाईं ___ हुनुहुन्छ?",
          fillInBlanksOptions2: ["कस्तो", "कहाँ", "किन"],
          fillInBlanksAnswer2: "कस्तो"
        }
      },
      {
        name: "Bhojpuri",
        code: "bhojpuri",
        translations: {
          man: "आदमी",
          woman: "औरत",
          robot: "रोबोट",
          hello: "प्रणाम",
          thankyou: "धन्यवाद",
          welcome: "स्वागत बा",
          goodbye: "राम राम",
          myNameIsRam: "हमार नाम राम हवे",
          whatIsYourNameWordBank: ["तोहार", "नाम", "का", "हवे", "?"],
          whatIsYourName: "तोहार नाम का हवे?",
          iAmHappy: "हम खुश हईं",
          iAmSad: "हम दुःखी हईं",
          iAmAngry: "हम गुस्सा में हईं",
          fillInBlanksSentence: "तोहसे ___ भेंट भइल।",
          fillInBlanksOptions: ["मिलके", "देखके", "सुनके"],
          fillInBlanksAnswer: "मिलके",
          goodMorning: "सुप्रभात",
          iAmFromNepalWordBank: ["हम", "नेपाल", "से", "हईं", "।"],
          iAmFromNepal: "हम नेपाल से हईं।",
          iDontUnderstand: "हम ना समझलीं",
          excuseMe: "माफ करीं",
          please: "कृपया",
          sorry: "माफी चाहतानी",
          howOldAreYou: "तोहार उमिर कतना हवे?",
          fillInBlanksSentence2: "प्रणाम, तू ___ बाड़ऽ?",
          fillInBlanksOptions2: ["केहन", "कहाँ", "काहे"],
          fillInBlanksAnswer2: "केहन"
        }
      },
      {
        name: "Tamang",
        code: "tamang",
        translations: {
          man: "म्यार्",
          woman: "मीम्वाई",
          robot: "रोबोट",
          hello: "लास्सो",
          thankyou: "थुस्सी",
          welcome: "गोजो फैय",
          goodbye: "जो या",
          myNameIsRam: "ङा मिन राम ङा रे",
          whatIsYourNameWordBank: ["नोः", "मिन", "तोङ", "रे", "?"],
          whatIsYourName: "नोः मिन तोङ रे?",
          iAmHappy: "ङा ग्याम्सी रे",
          iAmSad: "ङा किम्सी रे",
          iAmAngry: "ङा छ्यार्सी रे",
          fillInBlanksSentence: "नोङ ___ थेत।",
          fillInBlanksOptions: ["ताम्", "थोङ", "थेत"],
          fillInBlanksAnswer: "थेत",
          goodMorning: "लोः सी",
          iAmFromNepalWordBank: ["ङा", "नेपाल", "दे", "रे", "।"],
          iAmFromNepal: "ङा नेपाल दे रे।",
          iDontUnderstand: "ङा मोघा",
          excuseMe: "मारी फो",
          please: "प्लीज",
          sorry: "क्षमा या",
          howOldAreYou: "नोः गित्ती वार्से जोल?",
          fillInBlanksSentence2: "लास्सो, नो ___ रे?",
          fillInBlanksOptions2: ["कोथे", "कनी", "तारी"],
          fillInBlanksAnswer2: "कोथे"
        }
      },
      {
        name: "Maithili",
        code: "maithili",
        translations: {
          man: "पुरुष",
          woman: "स्त्री",
          robot: "रोबोट",
          hello: "प्रणाम",
          thankyou: "धन्यवाद",
          welcome: "स्वागतम्",
          goodbye: "प्रणाम",
          myNameIsRam: "हमर नाम राम अछि",
          whatIsYourNameWordBank: ["अहाँक", "नाम", "की", "अछि", "?"],
          whatIsYourName: "अहाँक नाम की अछि?",
          iAmHappy: "हम प्रसन्न छी",
          iAmSad: "हम दुखित छी",
          iAmAngry: "हम क्रोधित छी",
          fillInBlanksSentence: "अहाँकेँ ___ भेटल।",
          fillInBlanksOptions: ["भेटिकए", "देखिकए", "सुनिकए"],
          fillInBlanksAnswer: "भेटिकए",
          goodMorning: "सुप्रभात",
          iAmFromNepalWordBank: ["हम", "नेपाल", "सँ", "छी", "।"],
          iAmFromNepal: "हम नेपाल सँ छी।",
          iDontUnderstand: "हम नहि बुझलहुँ",
          excuseMe: "क्षमा करू",
          please: "कृपया",
          sorry: "माफी",
          howOldAreYou: "अहाँक उमेर कतेक अछि?",
          fillInBlanksSentence2: "प्रणाम, अहाँ ___ छी?",
          fillInBlanksOptions2: ["केहन", "कतय", "किएक"],
          fillInBlanksAnswer2: "केहन"
        }
      },
      {
        name: "Tharu",
        code: "tharu",
        translations: {
          man: "मनई",
          woman: "महिला",
          robot: "रोबोट",
          hello: "नमस्कार",
          thankyou: "धन्यवाद",
          welcome: "स्वागत बा",
          goodbye: "फेर भेंटाम",
          myNameIsRam: "हमर नाम राम हय",
          whatIsYourNameWordBank: ["तोहर", "नाम", "का", "हय", "?"],
          whatIsYourName: "तोहर नाम का हय?",
          iAmHappy: "हम खुशी बानी",
          iAmSad: "हम दुखी बानी",
          iAmAngry: "हम रिसाइल बानी",
          fillInBlanksSentence: "तोके ___ पाइल।",
          fillInBlanksOptions: ["भेटी", "देखी", "सुनी"],
          fillInBlanksAnswer: "भेटी",
          goodMorning: "सुभ बिहान",
          iAmFromNepalWordBank: ["हम", "नेपाल", "के", "हय", "।"],
          iAmFromNepal: "हम नेपाल के हय।",
          iDontUnderstand: "हम नै समझनी",
          excuseMe: "माफ करs",
          please: "कृपया",
          sorry: "क्षमा करs",
          howOldAreYou: "तोहर उमेर केतना हय?",
          fillInBlanksSentence2: "नमस्कार, तू ___ हs?",
          fillInBlanksOptions2: ["केसन", "कहाँ", "काहे"],
          fillInBlanksAnswer2: "केसन"
        }
      },
      {
        name: "Nepal Bhasa",
        code: "nepal_bhasa",
        translations: {
          man: "मनु",
          woman: "मिसा",
          robot: "रोबोट",
          hello: "ज्वजलपा",
          thankyou: "सुभाय्",
          welcome: "लसकुस",
          goodbye: "लिसः वने",
          myNameIsRam: "जिगु नां राम खः",
          whatIsYourNameWordBank: ["छिगु", "नां", "छु", "खः", "?"],
          whatIsYourName: "छिगु नां छु खः?",
          iAmHappy: "जि लय् जुल",
          iAmSad: "जि नुगः मछिं",
          iAmAngry: "जि तं वल",
          fillInBlanksSentence: "छितः ___ तसकं लय् जुल।",
          fillInBlanksOptions: ["नापलाःगु", "नाप", "नापं"],
          fillInBlanksAnswer: "नापलाःगु",
          goodMorning: "सुभाय् सकाल",
          iAmFromNepalWordBank: ["जि", "नेपालं", "खः", "।"],
          iAmFromNepal: "जि नेपालं खः।",
          iDontUnderstand: "जिं मथू",
          excuseMe: "क्षमा यानादिसँ",
          please: "दयायानादिसँ",
          sorry: "क्षमा",
          howOldAreYou: "छिगु उमर गुलि जुल?",
          fillInBlanksSentence2: "ज्वजलपा। छी ___ दुला?",
          fillInBlanksOptions2: ["बांलाः", "छु", "बिमार"],
          fillInBlanksAnswer2: "बांलाः"
        }
      },
      {
        name: "English",
        code: "english",
        translations: {
          man: "Man",
          woman: "Woman",
          robot: "Robot",
          hello: "Hello",
          thankyou: "Thank you",
          welcome: "Welcome",
          goodbye: "Goodbye",
          myNameIsRam: "My name is Ram",
          whatIsYourNameWordBank: ["What", "is", "your", "name", "?"],
          whatIsYourName: "What is your name?",
          iAmHappy: "I am happy",
          iAmSad: "I am sad",
          iAmAngry: "I am angry",
          fillInBlanksSentence: "It was nice ___ you.",
          fillInBlanksOptions: ["meeting", "seeing", "hearing"],
          fillInBlanksAnswer: "meeting",
          goodMorning: "Good morning",
          iAmFromNepalWordBank: ["I", "am", "from", "Nepal", "."],
          iAmFromNepal: "I am from Nepal.",
          iDontUnderstand: "I don't understand",
          excuseMe: "Excuse me",
          please: "Please",
          sorry: "Sorry",
          howOldAreYou: "How old are you?",
          fillInBlanksSentence2: "Hello, how ___ you?",
          fillInBlanksOptions2: ["are", "do", "will"],
          fillInBlanksAnswer2: "are"
        }
      }
    ];
    
    // Create questions for each language
    for (const lang of languagesData) {
      const filePath = createDemoQuestions(lang.name, lang.code, lang.translations);
      console.log(`Created questions for ${lang.name}`);
    }
    
    console.log("Finished creating demo questions for all languages");
  } catch (error) {
    console.error("Error creating demo questions:", error);
    throw new Error("Failed to create demo questions");
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
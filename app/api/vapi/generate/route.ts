// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// import { db } from "@/firebase/admin";
// import { getRandomInterviewCover } from "@/lib/utils";

// export async function POST(request: Request) {
//   const { type, role, level, techstack, amount, userid } = await request.json();

//   try {
//     const { text: questions } = await generateText({
//       model: google("gemini-2.0-flash-001"),
//       prompt: `Prepare questions for a job interview.
//         The job role is ${role}.
//         The job experience level is ${level}.
//         The tech stack used in the job is: ${techstack}.
//         The focus between behavioural and technical questions should lean towards: ${type}.
//         The amount of questions required is: ${amount}.
//         Please return only the questions, without any additional text.
//         The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//         Return the questions formatted like this:
//         ["Question 1", "Question 2", "Question 3"]
        
//         Thank you! <3
//     `,
//     });

//     const interview = {
//       role: role,
//       type: type,
//       level: level,
//       techstack: techstack.split(","),
//       questions: JSON.parse(questions),
//       userId: userid,
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };

//     await db.collection("interviews").add(interview);

//     return Response.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return Response.json({ success: false, error: error }, { status: 500 });
//   }
// }

// export async function GET() {
//   return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
// }

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { type, role, level, techstack, amount, userid } = body;

    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY!,
    });

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.

STRICT INSTRUCTIONS:
- Return ONLY a valid JSON array
- Do NOT add explanation
- Do NOT add extra text
- Do NOT add markdown
- Output must start with [ and end with ]

Example:
["Question 1", "Question 2", "Question 3"]
`,
    });

    // 🔥 CLEAN + SAFE PARSING
    let parsedQuestions: string[] = [];

    try {
      const cleaned = text.match(/\[.*\]/s)?.[0];

      if (!cleaned) {
        throw new Error("No JSON array found");
      }

      parsedQuestions = JSON.parse(cleaned);

      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Parsed result is not an array");
      }
    } catch (err) {
      console.error("Parsing failed. Raw AI output:", text);

      // fallback (so your app never crashes)
      parsedQuestions = [
        "Tell me about yourself",
        "Explain a project you worked on",
        "What are your strengths?",
      ];
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    return Response.json(
      { success: false, error: "Failed to generate interview" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    { success: true, data: "Thank you!" },
    { status: 200 }
  );
}
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate's resume and the job description ranging from 0 to 100"),
    technicalQuestions: z.array(z.object({
        question:z.string().describe("The technical question that can be asked in the interview"),
        intention:z.string().describe("The intention of interviewer to ask the technical question"),
        answer:z.string().describe(" How to answer this question, what points to cover, what approach to take etc ")  
    })).describe("List of technical questions that can be asked in the interview along with their intention and how to answer them"),
    
    behaviouralQuestions: z.array(z.object({
        question:z.string().describe("The behavioural question that can be asked in the interview"),
        intention:z.string().describe("The intention of interviewer to ask the behavioural question"),
        answer:z.string().describe(" How to answer this question, what points to cover, what approach to take etc ")  
    })).describe("List of behavioural questions that can be asked in the interview along with their intention and how to answer them") ,
    
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that is missing or needs to be improved"),
        severity: z.enum(["Low","Medium","High"]).describe("The severity of the skill gap, can be 'Low', 'Medium', or 'High'")  
    })).describe("List of skill gaps that can be there in the candidate along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of the day in the preparation plan, eg. data structures, system desig, mock interviews,etc"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, eg. read a specific book")
    })).describe("A day wise preparation plan for the candidate in order to prepare for the interview effectively"),
})

const jsonSchema = zodToJsonSchema(interviewReportSchema, "schema");
const cleanSchema = jsonSchema.definitions.schema;
delete cleanSchema.additionalProperties;

console.log(JSON.stringify(cleanSchema, null, 2));

ai.models.generateContent({
    model: 'gemini-2.5-flash', 
    contents: 'Respond with random dummy data that strictly adheres to the schema.', 
    config: {
        responseMimeType: 'application/json', 
        responseSchema: cleanSchema
    }
}).then(res => console.log("Response:", res.text)).catch(console.error);

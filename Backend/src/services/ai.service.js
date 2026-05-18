const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");   
const { zodToJsonSchema } = require("zod-to-json-schema"); 
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

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
    title: z.string().describe("Title of the job for which the interview report has been generated"),
})

// Helper to clean up Zod JSON schema for Gemini API
function cleanSchemaForGemini(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(cleanSchemaForGemini);
    } else if (obj !== null && typeof obj === 'object') {
        delete obj.$schema;
        delete obj.additionalProperties;
        for (const key in obj) {
            cleanSchemaForGemini(obj[key]);
        }
    }
    return obj;
}

async function generateInterviewReport({jobDescription,resume,selfDescription}) {

    const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription} 

    IMPORTANT: You must return ONLY a JSON object that strictly adheres to the provided responseSchema. Do not include markdown formatting or extra text.
    `
    
  const jsonSchema = zodToJsonSchema(interviewReportSchema, "schema");
  const cleanSchema = cleanSchemaForGemini(jsonSchema.definitions.schema);

  const response = await ai.models.generateContent({
    model:"gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: cleanSchema
    }
  })
  return JSON.parse(response.text); 
}

async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0"});
    const pdfBuffer = await page.pdf({format:"A4"}); 
    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({resume, selfDescription, jobDescription}){
    const resumePdfSchema = z.object({
        html: z.string().describe("HTML content of the resume which can be converted into PDF using library like puppeteer")

    })
    const prompt = `You are an expert resume writer, recruiter, and ATS optimization specialist.

Your task is to generate a highly professional, ATS-friendly, tailored resume in clean HTML format.

CANDIDATE INFORMATION:

EXISTING RESUME:
${resume}
##IMPORTANT: Dont simply copy the content of this resume, think and take content which is needed but the end goal is to get a tailored resume for the particular job description    

SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:

- Tailor the resume specifically for the provided job description.
- Prioritize the most relevant skills, projects, technologies, and experiences for the role.
- Rewrite and improve existing content to sound stronger, more professional, and achievement-oriented while remaining truthful.
- Do NOT invent fake companies, fake experience, fake projects, or unrealistic achievements.
- Use natural, human-like writing. Avoid robotic or AI-generated sounding phrases.
- Use concise and impactful bullet points.
- Include ATS-friendly keywords naturally from the job description.
- Emphasize measurable impact whenever possible.
- Keep the tone modern, confident, and realistic.

RESUME STRUCTURE:

Create a well-structured resume with sections such as:
- Header
- Professional Summary
- Skills
- Experience
- Projects
- Education
- Certifications
- Achievements

HTML REQUIREMENTS:

- Return ONLY a valid JSON object.
- Do NOT wrap the response in markdown.
- JSON format:

{
  "html": "<complete HTML here>"
}

- The HTML must be complete and production-ready.
- Use semantic HTML.
- Use ONLY inline CSS.
- Design should be modern, minimal, clean, and professional.
- Use subtle colors only.
- Ensure excellent spacing and typography.
- The resume must look good when converted to PDF using Puppeteer.
- Avoid page overflow issues.
- Keep the resume compact and readable.
- Prefer a single-page layout when possible.
- Do NOT use external CSS, scripts, icons, or images.
- Ensure the HTML is fully self-contained.

VERY IMPORTANT:

- The resume should feel genuinely written by a human recruiter.
- Avoid generic filler statements.
- Make the candidate appear strong but believable.
- Focus heavily on relevance to the target job description.
`

    const jsonSchema = zodToJsonSchema(resumePdfSchema, "schema");
    const cleanSchema = cleanSchemaForGemini(jsonSchema.definitions.schema);

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: cleanSchema
        }
    })
    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;

}

module.exports = {generateInterviewReport,generateResumePdf};
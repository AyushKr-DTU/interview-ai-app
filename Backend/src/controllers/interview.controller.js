const { PDFParse } = require("pdf-parse");
const { generateInterviewReport,generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @desc controller to generate interview report based on user self description , resume and job description 
 */
async function generateInterviewReportController(req,res){
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }
    // const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();   
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const resumeContent = pdfData.text;

        
        const {selfDescription, jobDescription } = req.body;  
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,  
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi    
        }); 

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport     
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        
        // Handle Gemini 503 or Unavailable errors gracefully
        const isUnavailable = error?.status === 503 || error?.status === 'UNAVAILABLE' || (error.message && error.message.includes('503'));
        if (isUnavailable) {
            return res.status(503).json({
                message: "The AI service is currently experiencing high demand. Please try again later.",
                error: error.message
            });
        }
        
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


/**
 * @desc controller to get interview report by id  
 */
async function getInterviewReportByIdController(req,res){

    const {interviewId} = req.params;
    const interviewReport = await interviewReportModel.findOne({_id: interviewId,user: req.user.id});

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })  
    }   
    res.status(200).json({  
        message:"Interview report fetched successfully",
        interviewReport
    })
}   
/**
 * @desc controller to get all interview reports of the user
 */
async function getAllInterviewReportsController(req,res){

    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan");  
    if(!interviewReports){
        return res.status(404).json({
            message:"No interview reports found"
        })
    }
    
    res.status(200).json({  
        message:"Interview report fetched successfully",
        interviewReports
    })
}   

/**
 * @desc controller to generate resume pdf based on  user self deccription, resume and job description
 */

async function generateResumePdfController(req,res){
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found",
            })
        }
        const { resume, selfDescription, jobDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({
            resume,
            selfDescription,
            jobDescription,
        }); 

        res.set({
            "Content-Type": "application/octet-stream"
        });
        res.send(pdfBuffer);  
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        
        // Handle Gemini 503 or Unavailable errors gracefully
        const isUnavailable = error?.status === 503 || error?.status === 'UNAVAILABLE' || (error.message && error.message.includes('503'));
        if (isUnavailable) {
            return res.status(503).json({
                message: "The AI service is currently experiencing high demand. Please try again later.",
                error: error.message
            });
        }
        
        res.status(500).json({ 
            message: "Failed to generate resume PDF. Internal server error.", 
            error: error.message 
        });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}   
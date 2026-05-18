const mongoose = require("mongoose"); 


/**
 * -job description schema :String
 * -resume text: String
 * -self description:String
 * -matchScore: Number
 *    
 * -Technical questions : 
 *        [{
 *            question:":,
 *            intention:"",
 *            answer: ""
 *        }]
 * -Behavioural questions : [{
 *            question:":,
 *            intention:"",
 *            answer: ""
 *        }]
 * -Skill gaps  : [{
 *                    skill:"",
 *                    severity: {
 *                        type:string,
 *                        enum:["Low","Medium","High"]
 *                    } 
 * }]
 * -Preparation plan : "[{perday object
 *                                     
 *                       day: Number,
 *                       focus: String,
 *                       tasks: [String],
 *                     }]
 * 
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
         type: String,
         required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, { _id : false } )    

const behaviouralQuestionsSchema = new mongoose.Schema({
    question: {
        type:   String,
        required: [true, "Behavioural question is required"] ,
    },
    intention: {
        type: String,
        required: [true, "Behavioural question Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Behavioural question answer is required"]
    }
}, { _id : false } )    

const skillGapsSchema = new mongoose.Schema({
    skill: { 
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum:["Low","Medium","High"], 
        required: [true, "Severity is required"]
    }
}, { _id: false });    

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,   
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Tasks is required"]   
    }]
}, { _id: false });    
 
const interviewReportSchema = new mongoose.Schema({
    jobDescription: { 
        type: String,
        required: [true , "Job description is required"] 
    },  
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100 
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }  ,
    title:{
        type: String,
        required: [true, "Job Title is required"]
    }


}, { timestamps: true })


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);
module.exports = interviewReportModel; 
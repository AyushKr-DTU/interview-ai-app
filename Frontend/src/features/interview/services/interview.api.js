import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})


/**
 * @description Function to generate interview report
 */
export const generateInterviewReport = async ({ jobDescription, resumeFile, selfDescription }) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data;
}

/**
 * @description Function to get interview report by interview id
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

export const generateResumePdf = async (interviewId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewId}`, {}, {
        responseType: 'blob'
    })
    return response.data;
}

/**
 * @description Function to get all interview reports for a user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get(`/api/interview`);
    return response.data;
}

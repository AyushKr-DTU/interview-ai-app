import { getAllInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";
const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();
    
    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider");
    }
    const { loading, setLoading, report, setReport, reports, setReports } = context;
    const [isDownloading, setIsDownloading] = useState(false);

    const generateReport = async ({ jobDescription, resumeFile, selfDescription }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, resumeFile, selfDescription });
            setReport(response.interviewReport);
        } catch (error) {
            console.log("Error while generating report:", error);
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getReportById = async (interviewId) => {

        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.log("Error while fetching report by id:", error);
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.log("Error while fetching all reports:", error);
        } finally {
            setLoading(false);
        }
        return response.interviewReports;
    }

    const getResumePdf = async (interviewReportId) => {
        setIsDownloading(true)
        let response = null
        try {
            response = await generateResumePdf(interviewReportId)
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        }
        catch (error) {
            console.log(error)
            alert("Failed to generate resume. AI service might be busy, please try again later.");
        } finally {
            setIsDownloading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId])
    return {
        loading, report, reports, generateReport, getReportById, getReports, getResumePdf, isDownloading
    }
}

export default useInterview;

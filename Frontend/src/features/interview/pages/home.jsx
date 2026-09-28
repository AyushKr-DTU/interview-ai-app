import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import "../style/home.scss";
import useInterview from "../hooks/useInterview";
import LoadingScreen from "../../../components/LoadingScreen";
import BrandLogo from "../../../components/BrandLogo";

const scoreTone = (score) => {
    if (score >= 75) return "high";
    if (score >= 50) return "mid";
    return "low";
};

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();
    const [resumeFile, setResumeFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        if (data?._id) {
            navigate(`/interview/${data._id}`);
        }
    };

    if (loading) {
        return (
            <LoadingScreen
                title="Generating your report"
                subtitle="Analyzing resume and job description…"
            />
        );
    }

    const JD_MAX = 5000;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setResumeFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setResumeFile(file);
    };

    return (
        <div className="dash">
            <header className="dash__top">
                <div className="dash__top-inner">
                    <BrandLogo />
                    <nav className="dash__top-nav">
                        <Link to="/app" className="dash__top-link dash__top-link--active">Workspace</Link>
                        <Link to="/logout" className="dash__top-link">Logout</Link>
                    </nav>
                </div>
            </header>

            <main className="dash__main">
                <div className="dash__intro">
                    <h1>Create interview prep</h1>
                    <p>Upload your resume, paste the job description, and generate a personalized plan.</p>
                </div>

                <section className="dash__create" id="create">
                    <div className="dash__field">
                        <div className="dash__field-head">
                            <label htmlFor="jobDescription">Job description</label>
                            <span className="dash__required">Required</span>
                        </div>
                        <textarea
                            id="jobDescription"
                            name="jobDescription"
                            className="dash__textarea"
                            placeholder="Paste the full job description…"
                            maxLength={JD_MAX}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <span className="dash__hint">{jobDescription.length} / {JD_MAX}</span>
                    </div>

                    <div className="dash__field">
                        <div className="dash__field-head">
                            <label>Resume</label>
                            <span className="dash__hint-inline">PDF or DOCX · max 3MB</span>
                        </div>
                        <div
                            className={`dash__dropzone ${isDragging ? "dash__dropzone--dragging" : ""} ${resumeFile ? "dash__dropzone--filled" : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => resumeInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") resumeInputRef.current?.click();
                            }}
                        >
                            {resumeFile ? (
                                <p className="dash__dropzone-file">{resumeFile.name}</p>
                            ) : (
                                <>
                                    <p className="dash__dropzone-title">Drop resume here or click to upload</p>
                                    <p className="dash__dropzone-sub">Recommended for best results</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={resumeInputRef}
                            hidden
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="dash__field">
                        <div className="dash__field-head">
                            <label htmlFor="selfDescription">Self-description</label>
                            <span className="dash__hint-inline">Optional if resume uploaded</span>
                        </div>
                        <textarea
                            id="selfDescription"
                            name="selfDescription"
                            className="dash__textarea dash__textarea--short"
                            placeholder="Briefly describe your experience and key skills…"
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                        />
                    </div>

                    <div className="dash__actions">
                        <p className="dash__meta">Typically ready in about 30 seconds</p>
                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            className="dash__primary"
                            disabled={!jobDescription.trim()}
                        >
                            Generate prep plan
                        </button>
                    </div>
                </section>

                {reports && reports.length > 0 && (
                    <section className="dash__reports">
                        <div className="dash__reports-head">
                            <h2>Recent reports</h2>
                            <a href="#create" className="dash__link-btn">New prep plan</a>
                        </div>
                        <ul className="dash__report-list">
                            {reports.map((report) => (
                                <li key={report._id}>
                                    <button
                                        type="button"
                                        className="dash__report"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                    >
                                        <span className={`dash__score dash__score--${scoreTone(report.matchScore)}`}>
                                            {report.matchScore}
                                        </span>
                                        <span className="dash__report-body">
                                            <span className="dash__report-title">{report.title || "Interview report"}</span>
                                            <span className="dash__report-meta">
                                                {new Date(report.createdAt).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </span>
                                        <span className="dash__report-fit">
                                            {report.matchScore >= 75 ? "Strong" : report.matchScore >= 50 ? "Moderate" : "Needs work"}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;

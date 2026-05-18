import React, { useState, useRef } from "react";
import {useNavigate} from "react-router";
import "../style/home.scss";
import useInterview from "../hooks/useInterview";

const Home = () => {
    const {loading,generateReport,reports} = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();
    const [resumeFile, setResumeFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        const data = await generateReport({jobDescription, selfDescription, resumeFile});
        if (data?._id) {
            navigate(`/interview/${data._id}`);
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loading-screen__orb" />
                <div className="loading-screen__content">
                    <div className="loading-screen__spinner">
                        <span /><span /><span />
                    </div>
                    <h2 className="loading-screen__title">Generating Your Report</h2>
                    <p className="loading-screen__sub">Our AI is analyzing your resume and job description…</p>
                    <div className="loading-screen__steps">
                        <span className="loading-screen__step loading-screen__step--done">✓ Parsing resume</span>
                        <span className="loading-screen__step loading-screen__step--active">⟳ Matching skills</span>
                        <span className="loading-screen__step">○ Building prep plan</span>
                    </div>
                </div>
            </main>
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
        <main className="home">
            {/* Page Header */}
            <header className="home__header">
                <h1 className="home__title">
                    Create Your Custom{" "}
                    <span className="home__title--accent">Interview Plan</span>
                </h1>
                <p className="home__subtitle">
                    Let our AI analyze the job requirements and your unique profile to build a
                    winning strategy.
                </p>
                <span className="home__icon">✦</span>
            </header>

            {/* Main Card */}
            <section className="home__card">
                {/* Left Column — Job Description */}
                <div className="home__col home__col--left">
                    <div className="home__col-header">
                        <div className="home__col-title">
                            <span className="home__col-icon">💼</span>
                            <h2>Target Job Description</h2>
                        </div>
                        <span className="badge badge--required">Required</span>
                    </div>
                    <textarea
                        onChange= {(e)=> {setJobDescription(e.target.value)}}
                        className="home__textarea"
                        id="jobDescription"
                        name="jobDescription"
                        placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                        maxLength={JD_MAX}
                        value={jobDescription}
                    />
                    <span className="home__char-count">
                        {jobDescription.length} / {JD_MAX} chars
                    </span>
                </div>

                {/* Divider */}
                <div className="home__divider" />

                {/* Right Column — Your Profile */}
                <div className="home__col home__col--right">
                    <div className="home__col-header">
                        <div className="home__col-title">
                            <span className="home__col-icon">👤</span>
                            <h2>Your Profile</h2>
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="home__upload-section">
                        <label className="home__upload-label">
                            Upload Resume{" "}
                            <span className="badge badge--best">Best Results</span>
                        </label>
                        <div
                            className={`home__dropzone ${isDragging ? "home__dropzone--dragging" : ""} ${resumeFile ? "home__dropzone--filled" : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("resume").click()}
                        >
                            <div className="home__dropzone-icon">☁</div>
                            {resumeFile ? (
                                <p className="home__dropzone-filename">{resumeFile.name}</p>
                            ) : (
                                <>
                                    <p className="home__dropzone-text">Click to upload or drag &amp; drop</p>
                                    <p className="home__dropzone-subtext">PDF or DOCX (Max 5MB)</p>
                                </>
                            )}
                        </div>
                        <input 
                            ref = {resumeInputRef}
                            hidden
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* OR Divider */}
                    <div className="home__or-divider">
                        <span>OR</span>
                    </div>

                    {/* Self Description */}
                    <div className="home__self-desc">
                        <label className="home__upload-label" htmlFor="selfDescription">
                            Quick Self-Description
                        </label>
                        <textarea
                            onChange= {(e)=> {setSelfDescription(e.target.value)}}
                            className="home__textarea home__textarea--short"
                            id="selfDescription"
                            name="selfDescription"
                            placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            value={selfDescription}

                        />
                    </div>

                    {/* Info Notice */}
                    <div className="home__notice">
                        <span className="home__notice-icon">ℹ</span>
                        <p>
                            Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
                            required to generate a personalized plan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Card Footer — inside the card wrapper */}
            <footer className="home__card-footer">
                <span className="home__footer-meta">AI-Powered Strategy Generation • Approx 30s</span>
                <button onClick={handleGenerateReport} className="home__generate-btn">
                    ✦ Generate My Interview Strategy
                </button>
            </footer>

            {/* Recent Reports */}
            {reports && reports.length > 0 && (
                <section className="recent-reports">
                    <h2 className="recent-reports__heading">
                        <span className="recent-reports__heading-icon">📋</span>
                        Recent Reports
                    </h2>
                    <ul className="reports-list">
                        {reports.map(report => (
                            <li
                                key={report._id}
                                className="report-item"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className="report-item__score-ring">
                                    <span className="report-item__score-value"
                                        style={{ color: report.matchScore >= 75 ? '#22c55e' : report.matchScore >= 50 ? '#f59e0b' : '#e91e8c' }}>
                                        {report.matchScore}
                                    </span>
                                    <span className="report-item__score-label">%</span>
                                </div>
                                <div className="report-item__body">
                                    <h3 className="report-item__title">{report.title || 'Interview Report'}</h3>
                                    <p className="report-item__meta">
                                        Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`report-item__badge ${report.matchScore >= 75 ? 'report-item__badge--high' : report.matchScore >= 50 ? 'report-item__badge--mid' : 'report-item__badge--low'}`}>
                                    {report.matchScore >= 75 ? 'Strong' : report.matchScore >= 50 ? 'Moderate' : 'Needs Work'}
                                </span>
                                <span className="report-item__arrow">→</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <nav className="home__page-footer">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Help Center</a>
            </nav>
        </main>
    );
};

export default Home;
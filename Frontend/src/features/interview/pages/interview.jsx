import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import "../style/interview.scss";
import useInterview from "../hooks/useInterview";
import LoadingScreen from "../../../components/LoadingScreen";
import BrandLogo from "../../../components/BrandLogo";

const SeverityBadge = ({ severity }) => (
    <span className={`severity severity--${severity.toLowerCase()}`}>
        {severity}
    </span>
);

const QuestionItem = ({ index, question, intention, answer }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`q-item ${open ? "q-item--open" : ""}`}>
            <button type="button" className="q-item__header" onClick={() => setOpen(!open)}>
                <span className="q-item__index">{String(index + 1).padStart(2, "0")}</span>
                <p className="q-item__question">{question}</p>
                <span className="q-item__chevron">{open ? "−" : "+"}</span>
            </button>
            {open && (
                <div className="q-item__body">
                    <div className="q-item__block">
                        <h4>Interviewer intent</h4>
                        <p>{intention}</p>
                    </div>
                    <div className="q-item__block">
                        <h4>How to answer</h4>
                        <p>{answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const TABS = ["Technical", "Behavioural", "Skill gaps", "Roadmap", "Resume"];

const scoreColor = (score) => {
    if (score >= 75) return "#059669";
    if (score >= 50) return "#d97706";
    return "#dc2626";
};

const Interview = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { report, getReportById, loading, getResumePdf, isDownloading } = useInterview();
    const { interviewId } = useParams();

    useEffect(() => {
        getReportById(interviewId);
    }, [interviewId]);

    if (loading || !report) {
        return (
            <LoadingScreen
                title="Loading report"
                subtitle="Fetching your interview plan…"
            />
        );
    }

    return (
        <div className="report">
            <header className="report__top">
                <div className="report__top-inner">
                    <BrandLogo />
                    <nav className="report__top-nav">
                        <button type="button" className="report__top-link" onClick={() => navigate("/app")}>
                            Workspace
                        </button>
                        <Link to="/logout" className="report__top-link">Logout</Link>
                    </nav>
                </div>
            </header>

            <div className="report__layout">
                <aside className="report__aside">
                    <button type="button" className="report__back" onClick={() => navigate("/app")}>
                        ← Back to workspace
                    </button>

                    <div className="report__score-block">
                        <p className="report__label">Match score</p>
                        <p className="report__score" style={{ color: scoreColor(report.matchScore) }}>
                            {report.matchScore}
                            <span>/100</span>
                        </p>
                        <p className="report__score-desc">
                            {report.matchScore >= 75
                                ? "Strong match for this role."
                                : report.matchScore >= 50
                                    ? "Moderate fit — prioritize key gaps."
                                    : "Focus prep on high-severity gaps."}
                        </p>
                    </div>

                    <div className="report__aside-section">
                        <p className="report__label">Skill gaps</p>
                        <ul className="report__gap-list">
                            {report.skillGaps.map((gap, i) => (
                                <li key={i}>
                                    <SeverityBadge severity={gap.severity} />
                                    <span>{gap.skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="report__aside-section">
                        <p className="report__label">Roadmap</p>
                        <ul className="report__day-nav">
                            {report.preparationPlan.map((p) => (
                                <li key={p.day}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab(3);
                                            setTimeout(() => {
                                                document.getElementById(`day-${p.day}`)?.scrollIntoView({ behavior: "smooth" });
                                            }, 50);
                                        }}
                                    >
                                        <span>Day {p.day}</span>
                                        <span>{p.focus}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="report__main">
                    <header className="report__header">
                        <div>
                            <h1>{report.title || "Interview report"}</h1>
                            <p>AI analysis based on your resume and job description</p>
                        </div>
                    </header>

                    <div className="report__tabs" role="tablist">
                        {TABS.map((tab, i) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === i}
                                className={`report__tab ${activeTab === i ? "report__tab--active" : ""}`}
                                onClick={() => setActiveTab(i)}
                            >
                                {tab}
                                {i < 4 && (
                                    <span>
                                        {i === 0 && report.technicalQuestions.length}
                                        {i === 1 && report.behaviouralQuestions.length}
                                        {i === 2 && report.skillGaps.length}
                                        {i === 3 && `${report.preparationPlan.length}d`}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="report__panel">
                        {activeTab === 0 && (
                            <div className="report__questions">
                                <p className="report__panel-note">
                                    Expand a question to see interviewer intent and answer guidance.
                                </p>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionItem key={i} index={i} {...q} />
                                ))}
                            </div>
                        )}

                        {activeTab === 1 && (
                            <div className="report__questions">
                                <p className="report__panel-note">
                                    Structure answers with STAR: Situation, Task, Action, Result.
                                </p>
                                {report.behaviouralQuestions.map((q, i) => (
                                    <QuestionItem key={i} index={i} {...q} />
                                ))}
                            </div>
                        )}

                        {activeTab === 2 && (
                            <div className="report__gaps">
                                <p className="report__panel-note">
                                    Areas where your profile does not fully align with the role.
                                </p>
                                {report.skillGaps.map((gap, i) => (
                                    <div key={i} className="report__gap-row">
                                        <SeverityBadge severity={gap.severity} />
                                        <span>{gap.skill}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 3 && (
                            <div className="report__roadmap">
                                <p className="report__panel-note">
                                    A {report.preparationPlan.length}-day plan to maximize interview readiness.
                                </p>
                                {report.preparationPlan.map((day) => (
                                    <div key={day.day} id={`day-${day.day}`} className="report__day">
                                        <div className="report__day-head">
                                            <span>Day {day.day}</span>
                                            <h3>{day.focus}</h3>
                                        </div>
                                        <ul>
                                            {day.tasks.map((task, ti) => (
                                                <li key={ti}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 4 && (
                            <div className="report__resume-panel">
                                <p className="report__panel-note">
                                    Generate a resume rewritten for this job description, optimized for ATS screening.
                                </p>
                                <div className="report__resume-doc">
                                    <div className="report__resume-doc-bar">
                                        <span>Preview</span>
                                        <span>ATS-friendly PDF</span>
                                    </div>
                                    <div className="report__resume-doc-body">
                                        <h2>Tailored resume</h2>
                                        <p>
                                            Your resume will be customized using your uploaded profile and this
                                            role&apos;s requirements — emphasizing relevant skills, experience,
                                            and keywords recruiters and ATS systems look for.
                                        </p>
                                        <ul className="report__resume-points">
                                            <li>Aligned to the target job description</li>
                                            <li>ATS-friendly formatting</li>
                                            <li>Downloads as a PDF you can submit directly</li>
                                        </ul>
                                        <button
                                            type="button"
                                            className="report__resume-btn"
                                            onClick={() => getResumePdf(interviewId)}
                                            disabled={isDownloading}
                                        >
                                            {isDownloading ? "Generating…" : "Download ATS-Friendly Resume"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Interview;

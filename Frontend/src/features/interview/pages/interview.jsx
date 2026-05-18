import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import "../style/interview.scss";
import useInterview from "../hooks/useInterview";


// const MOCK_REPORT = {
//     _id: "6a08db5107cf4d9afb824b37",
//     matchScore: 65,
//     technicalQuestions: [
//         {
//             question: "You mentioned using AsyncLocalStorage to enhance logging at Zupee. Can you explain how it works and why it was preferred over passing user IDs through every function call?",
//             intention: "To evaluate the candidate's deep understanding of Node.js execution context and their ability to solve cross-cutting concerns efficiently.",
//             answer: "Explain that AsyncLocalStorage allows storing data throughout the lifetime of an asynchronous resource. It avoids 'prop-drilling' of metadata (like requestId) through the call stack, ensuring every log statement within a specific request context automatically has access to relevant IDs without manual intervention.",
//         },
//         {
//             question: "How would you optimize a React application that is experiencing slow rendering due to large lists or frequent state updates?",
//             intention: "To test knowledge of frontend performance optimization, which is a key responsibility in the JD.",
//             answer: "Discuss techniques like windowing/virtualization for long lists (using libraries like react-window), memoization using React.memo, useMemo, and useCallback to prevent unnecessary re-renders, and profiling the app using React DevTools.",
//         },
//         {
//             question: "Explain the trade-offs between Raft and PBFT consensus algorithms based on your project experience.",
//             intention: "To gauge the candidate's understanding of distributed systems and high-level architectural concepts.",
//             answer: "Compare Raft (Crash Fault Tolerant, easier to understand/implement, requires a majority of honest nodes) vs PBFT (Byzantine Fault Tolerant, handles malicious nodes but has higher communication overhead). Explain the use cases for each in a hybrid system.",
//         },
//         {
//             question: "In your 'Inboxer' project, how did you handle session management and what are the security implications of using cookie-based sessions versus JWTs?",
//             intention: "To check the candidate's grasp of web security and backend architecture.",
//             answer: "Discuss the use of HttpOnly and Secure flags for cookies to prevent XSS. Compare the stateless nature of JWTs (scalability) vs. the stateful nature of session cookies (easier revocation). Mention password hashing with bcrypt and JWT verification middleware.",
//         },
//     ],
//     behaviouralQuestions: [
//         {
//             question: "Describe a time you identified a recurring technical issue, like the payment alert bug at Zupee, and took the initiative to fix it.",
//             intention: "To assess proactiveness and problem-solving skills in a professional environment.",
//             answer: "Use the STAR method. Detail how you noticed the 'non-actionable' New Relic alerts, the steps taken to investigate the root cause in the payment flow, and the impact (reducing error count to zero) on the team's operational overhead.",
//         },
//         {
//             question: "The JD mentions a fast-paced agile environment. How do you prioritize tasks when faced with multiple urgent deadlines?",
//             intention: "To evaluate time management and adaptability.",
//             answer: "Talk about using tools like Jira, communicating with product managers to understand business impact, and breaking down complex tasks into smaller deliverables to maintain momentum.",
//         },
//     ],
//     skillGaps: [
//         { skill: "Years of Professional Experience", severity: "High" },
//         { skill: "Advanced State Management (Redux/Zustand)", severity: "Medium" },
//         { skill: "PostgreSQL / Relational Database Deep-Dive", severity: "Low" },
//     ],
//     preparationPlan: [
//         { day: 1, focus: "Core Backend & Node.js Internals", tasks: ["Review Node.js Event Loop, Streams, and Buffer classes", "Deep dive into AsyncLocalStorage and its performance implications"] },
//         { day: 2, focus: "Frontend Frameworks (React)", tasks: ["Practice advanced React patterns (HOCs, Render Props, Custom Hooks)", "Implement a state management solution using Redux Toolkit to bridge the skill gap"] },
//         { day: 3, focus: "System Design & Databases", tasks: ["Study Scalability, Load Balancing, and Caching (Redis)", "Compare MongoDB aggregation pipelines with SQL complex joins"] },
//         { day: 4, focus: "Observability & Cloud Services", tasks: ["Review New Relic dashboarding and alerting strategies", "Study AWS SQS architecture and message visibility timeouts"] },
//         { day: 5, focus: "Coding Practice (DSA)", tasks: ["Solve 5-10 Medium/Hard problems on LeetCode focusing on Graphs and Dynamic Programming", "Practice implementing the MetroPath algorithm from scratch"] },
//         { day: 6, focus: "Behavioural & Soft Skills", tasks: ["Prepare STAR stories for every bullet point on the resume", "Research Innovatech Solutions' products and culture"] },
//         { day: 7, focus: "Mock Interviews & Review", tasks: ["Conduct a full-stack mock interview with a peer", "Final review of the project architectures (Inboxer and MetroPath)"] },
//     ],
// };

// ── Helper Components ─────────────────────────────────────────────────────

const SeverityBadge = ({ severity }) => (
    <span className={`severity-badge severity-badge--${severity.toLowerCase()}`}>
        {severity}
    </span>
);

const ScoreRing = ({ score }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#e91e8c";

    return (
        <div className="score-ring">
            <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={radius} className="score-ring__track" />
                <circle
                    cx="65" cy="65" r={radius}
                    className="score-ring__fill"
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="score-ring__label">
                <span className="score-ring__number" style={{ color }}>{score}</span>
                <span className="score-ring__sub">/ 100</span>
            </div>
        </div>
    );
};

const QuestionCard = ({ index, question, intention, answer }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`q-card ${open ? "q-card--open" : ""}`}>
            <button className="q-card__header" onClick={() => setOpen(!open)}>
                <span className="q-card__index">Q{index + 1}</span>
                <p className="q-card__question">{question}</p>
                <span className="q-card__chevron">▼</span>
            </button>
            <div className="q-card__body-wrapper">
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__section-label">💡 Interviewer's Intention</span>
                        <p>{intention}</p>
                    </div>
                    <div className="q-card__section q-card__section--answer">
                        <span className="q-card__section-label">✅ How to Answer</span>
                        <p>{answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────

const TABS = ["Technical", "Behavioural", "Skill Gaps", "Prep Plan"];

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
            <main className="loading-screen">
                <h1>Loading your interview report...</h1>
            </main>
        );
    }
    return (
        <div className="ir">
            {/* ── Sidebar ── */}
            <aside className="ir__sidebar">
                <button className="ir__back-btn" onClick={() => navigate("/")}>
                    ← Back
                </button>

                <div className="ir__score-section">
                    <p className="ir__score-label">Match Score</p>
                    <ScoreRing score={report.matchScore} />
                    <p className="ir__score-desc">
                        {report.matchScore >= 75
                            ? "Strong match — well prepared!"
                            : report.matchScore >= 50
                                ? "Moderate fit — some gaps to bridge"
                                : "Needs work — focus on key areas"}
                    </p>
                </div>

                <div className="ir__sidebar-divider" />

                <div className="ir__gaps-section">
                    <p className="ir__sidebar-heading">Skill Gaps</p>
                    <ul className="ir__gaps-list">
                        {report.skillGaps.map((gap, i) => (
                            <li key={i} className="ir__gap-item">
                                <SeverityBadge severity={gap.severity} />
                                <span>{gap.skill}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="ir__sidebar-divider" />

                <div className="ir__plan-nav">
                    <p className="ir__sidebar-heading">Prep Plan</p>
                    <ul className="ir__plan-nav-list">
                        {report.preparationPlan.map((p) => (
                            <li
                                key={p.day}
                                className="ir__plan-nav-item"
                                onClick={() => {
                                    setActiveTab(3);
                                    setTimeout(() => {
                                        document.getElementById(`day-${p.day}`)?.scrollIntoView({ behavior: "smooth" });
                                    }, 50);
                                }}
                            >
                                <span className="ir__plan-nav-day">Day {p.day}</span>
                                <span className="ir__plan-nav-focus">{p.focus}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="ir__sidebar-divider" />

                <div className="ir__sidebar-action">
                    <button
                        className={`ir__download-btn ir__download-btn--sidebar ${isDownloading ? 'ir__download-btn--loading' : ''}`}
                        onClick={() => getResumePdf(interviewId)}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <span className="ir__spinner"></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <span className="ir__icon">✨</span>
                                Download AI Resume
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="ir__main">
                <header className="ir__main-header">
                    <div>
                        <h1 className="ir__title">
                            Interview <span className="ir__title--accent">Report</span>
                        </h1>
                        <p className="ir__subtitle">AI-generated analysis based on your resume and job description</p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="ir__tabs">
                    {TABS.map((tab, i) => (
                        <button
                            key={tab}
                            className={`ir__tab ${activeTab === i ? "ir__tab--active" : ""}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {tab}
                            {i === 0 && <span className="ir__tab-count">{report.technicalQuestions.length}</span>}
                            {i === 1 && <span className="ir__tab-count">{report.behaviouralQuestions.length}</span>}
                            {i === 2 && <span className="ir__tab-count">{report.skillGaps.length}</span>}
                            {i === 3 && <span className="ir__tab-count">{report.preparationPlan.length}d</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="ir__panel">

                    {/* Technical Questions */}
                    {activeTab === 0 && (
                        <div className="ir__questions">
                            <p className="ir__panel-info">
                                ✦ &nbsp;Click a question to reveal the interviewer's intention and a model answer strategy.
                            </p>
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard key={i} index={i} {...q} />
                            ))}
                        </div>
                    )}

                    {/* Behavioural Questions */}
                    {activeTab === 1 && (
                        <div className="ir__questions">
                            <p className="ir__panel-info">
                                ✦ &nbsp;Use the STAR method (Situation, Task, Action, Result) to structure your answers.
                            </p>
                            {report.behaviouralQuestions.map((q, i) => (
                                <QuestionCard key={i} index={i} {...q} />
                            ))}
                        </div>
                    )}

                    {/* Skill Gaps */}
                    {activeTab === 2 && (
                        <div className="ir__skill-gaps">
                            <p className="ir__panel-info">
                                ✦ &nbsp;These are areas where your profile doesn't fully align with the job requirements.
                            </p>
                            {report.skillGaps.map((gap, i) => (
                                <div key={i} className="ir__gap-card">
                                    <div className="ir__gap-card-left">
                                        <SeverityBadge severity={gap.severity} />
                                        <span className="ir__gap-skill">{gap.skill}</span>
                                    </div>
                                    <div className={`ir__gap-bar ir__gap-bar--${gap.severity.toLowerCase()}`}>
                                        <div className="ir__gap-bar-fill" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Preparation Plan */}
                    {activeTab === 3 && (
                        <div className="ir__prep-plan">
                            <p className="ir__panel-info">
                                ✦ &nbsp;A structured {report.preparationPlan.length}-day plan to maximize your interview readiness.
                            </p>
                            {report.preparationPlan.map((day) => (
                                <div key={day.day} id={`day-${day.day}`} className="ir__day-card">
                                    <div className="ir__day-header">
                                        <span className="ir__day-badge">Day {day.day}</span>
                                        <h3 className="ir__day-focus">{day.focus}</h3>
                                    </div>
                                    <ul className="ir__day-tasks">
                                        {day.tasks.map((task, ti) => (
                                            <li key={ti} className="ir__day-task">
                                                <span className="ir__day-task-dot" />
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Interview;

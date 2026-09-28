import { Link } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";
import BrandLogo from "../../components/BrandLogo";
import "./landing.scss";

const FEATURES = [
    {
        title: "Personalized questions",
        text: "Technical and behavioural questions tailored to the role, with interviewer intent and answer guidance.",
    },
    {
        title: "Skill-gap analysis",
        text: "See where your profile falls short of the job requirements, ranked by severity.",
    },
    {
        title: "7-day preparation roadmap",
        text: "A focused day-by-day plan so you spend prep time where it matters most.",
    },
    {
        title: "AI-generated tailored resume",
        text: "Download an ATS-friendly resume rewritten to match the target job description.",
    },
];

const STEPS = [
    { n: "01", label: "Upload resume" },
    { n: "02", label: "Add job description" },
    { n: "03", label: "Get AI analysis" },
    { n: "04", label: "Prepare" },
];

const Landing = () => {
    const { user, loading } = useAuth();
    const isAuthed = !loading && Boolean(user);

    return (
        <div className="landing">
            <header className="landing__nav">
                <BrandLogo />
                <nav className="landing__nav-links">
                    <a href="#features">Features</a>
                    <a href="#how">How it works</a>
                </nav>
                <div className="landing__nav-actions">
                    {isAuthed ? (
                        <>
                            <Link to="/app" className="landing__link">Workspace</Link>
                            <Link to="/logout" className="landing__btn landing__btn--ghost">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="landing__link">Log in</Link>
                            <Link to="/register" className="landing__btn landing__btn--primary">
                                Start Interview Prep
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <section className="landing__hero">
                <div className="landing__hero-copy">
                    <p className="landing__eyebrow">AI interview preparation</p>
                    <h1>Prepare for the interview that gets you hired.</h1>
                    <p className="landing__lede">
                        Upload your resume, paste a job description, and get personalized questions,
                        skill gaps, a 7-day plan, and a tailored resume.
                    </p>
                    <div className="landing__cta">
                        <Link
                            to={isAuthed ? "/app" : "/register"}
                            className="landing__btn landing__btn--primary"
                        >
                            {isAuthed ? "Go to workspace" : "Start Interview Prep"}
                        </Link>
                        <a href="#how" className="landing__btn landing__btn--ghost">
                            How it works
                        </a>
                    </div>
                    <div className="landing__trust">
                        <span>Personalized questions</span>
                        <span>7-day roadmap</span>
                        <span>ATS resume</span>
                    </div>
                </div>

                <div className="landing__preview" aria-hidden="true">
                    <div className="landing__preview-bar">
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="landing__preview-body">
                        <div className="landing__preview-score">
                            <span className="landing__preview-score-value">78</span>
                            <span className="landing__preview-score-label">Match score</span>
                        </div>
                        <div className="landing__preview-rows">
                            <div className="landing__preview-row">
                                <span>Technical questions</span>
                                <span>12</span>
                            </div>
                            <div className="landing__preview-row">
                                <span>Skill gaps</span>
                                <span>4</span>
                            </div>
                            <div className="landing__preview-row">
                                <span>Prep roadmap</span>
                                <span>7 days</span>
                            </div>
                            <div className="landing__preview-row landing__preview-row--accent">
                                <span>Tailored resume</span>
                                <span>Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing__how" id="how">
                <h2>How it works</h2>
                <p>Four steps from resume to interview-ready.</p>
                <ol className="landing__steps">
                    {STEPS.map((step) => (
                        <li key={step.n}>
                            <span className="landing__step-n">{step.n}</span>
                            <span className="landing__step-label">{step.label}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="landing__features" id="features">
                <div className="landing__features-head">
                    <h2>Built for serious prep</h2>
                    <p>Everything you need to walk into the interview prepared.</p>
                </div>
                <ul className="landing__feature-list">
                    {FEATURES.map((f) => (
                        <li key={f.title}>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="landing__closing">
                <h2>Start with one job description.</h2>
                <p>Your first personalized interview plan takes a few minutes.</p>
                <Link
                    to={isAuthed ? "/app" : "/register"}
                    className="landing__btn landing__btn--primary"
                >
                    {isAuthed ? "Open workspace" : "Start Interview Prep"}
                </Link>
            </section>

            <footer className="landing__footer">
                <BrandLogo />
                <span>Interview prep, tailored to you</span>
            </footer>
        </div>
    );
};

export default Landing;

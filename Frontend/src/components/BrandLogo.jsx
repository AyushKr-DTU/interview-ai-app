import { Link } from "react-router";
import "./BrandLogo.scss";

const BrandLogo = ({ to = "/", className = "", showText = true }) => {
    const content = (
        <>
            <img src="/favicon.svg" alt="" className="brand-logo__icon" width="22" height="21" />
            {showText && <span className="brand-logo__text">InterviewAI</span>}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={`brand-logo ${className}`.trim()} aria-label="InterviewAI home">
                {content}
            </Link>
        );
    }

    return (
        <span className={`brand-logo ${className}`.trim()} aria-label="InterviewAI">
            {content}
        </span>
    );
};

export default BrandLogo;

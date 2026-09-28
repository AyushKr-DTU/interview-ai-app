import "../styles/loading.scss";

const LoadingScreen = ({ title = "Just a moment", subtitle = "Getting things ready…" }) => {
    return (
        <main className="app-loading" aria-busy="true" aria-live="polite">
            <div className="app-loading__content">
                <div className="app-loading__spinner" aria-hidden="true" />
                {title && <h1 className="app-loading__title">{title}</h1>}
                {subtitle && <p className="app-loading__sub">{subtitle}</p>}
            </div>
        </main>
    );
};

export default LoadingScreen;

import "../styles/Logo.css";

export default function Logo({ textColor = "#1f2937", className = "" }) {
    const containerClass = ["logo-container", className].filter(Boolean).join(" ");

    return (
        <div className={containerClass}>
            <div className="icon">
                <p>&#123;</p>
                <p>.</p>
                <p>&#125;</p>
            </div>
            <span style={{ color: textColor }}>DevConnect</span>
        </div>
    );
}
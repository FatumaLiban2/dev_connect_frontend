import { Link } from "react-router-dom";
import "../styles/SidebarButton.css";

export default function SidebarButton({ to, icon, label }) {
    return (
        <div className="sidebar-button-container">
            <Link to={to} className="sidebar-button" title={label}>
                <img src={icon} alt={`${label} icon`} />
                <p>{label}</p>
            </Link>
        </div>
    );
}
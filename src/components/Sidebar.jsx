import SidebarButton from "./SidebarButton";
import "../styles/Sidebar.css";
import DashboardIcon from "../assets/icons/DashboardIcon.svg";
import ProjectsIcon from "../assets/icons/ProfileIcon.svg";
import ProfileIcon from "../assets/icons/ProfileIcon.svg";
import FindClientsIcon from "../assets/icons/GroupIcon.svg";
import FindDeverlopersIcon from "../assets/icons/GroupIcon.svg";
import MessagesIcon from "../assets/icons/MessageIcon.svg";
import PaymentIcon from "../assets/icons/PaymentIcon.svg";
import SettingsIcon from "../assets/icons/SettingsIcon.svg";
import LogoutIcon from "../assets/icons/LogoutIcon.svg";
import Logo from "./Logo";

export default function Sidebar() {
    return (
        <div className="sidebar-container">
            <Logo />
                <SidebarButton to="/myProjects" icon={ProjectsIcon} label="My Projects" />
            <SidebarButton to="/dashboard" icon={DashboardIcon} label="Dashboard" />
            <SidebarButton to="/profile" icon={ProfileIcon} label="Profile" />
            <SidebarButton to="/findClients" icon={FindClientsIcon} label="Find Clients" />
            <SidebarButton to="/findDevelopers" icon={FindDeverlopersIcon} label="Find Developers" />
            <SidebarButton to="/messages" icon={MessagesIcon} label="Messages" />
            <SidebarButton to="/payments" icon={PaymentIcon} label="Payment" />
            <SidebarButton to="/settings" icon={SettingsIcon} label="Settings" />
            <SidebarButton to="/logout" icon={LogoutIcon} label="Logout" />
        </div>
    );
}

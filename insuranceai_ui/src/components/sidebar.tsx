import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiFileText,
    FiShield,
    FiBookOpen,
    FiMessageSquare,
    FiLayout,
} from "react-icons/fi";

const navLinks = [
    { to: "/", label: "Home", icon: <FiLayout size={18} /> },
    { to: "/document-analysis", label: "AI Document Analyze", icon: <FiBookOpen size={18} /> },
    { to: "/risk-assessment", label: "Risk Assessment", icon: <FiShield size={18} /> },
    { to: "/policy", label: "Policy Comparison", icon: <FiFileText size={18} /> },
    { to: "/claim-assistant", label: "Claim Assistant", icon: <FiFileText size={18} /> },
    { to: "/chatbot", label: "Chat Bot", icon: <FiMessageSquare size={18} /> },
];

const Sidebar: React.FC = () => {
    return (
        <aside className=" h-full max-w-80 border-r text-sm   border-slate-300 bg-white flex flex-col z-50 ">


            {/* Nav Links */}
            <nav className="flex flex-col flex-1 pr-8 py-6 space-y-2">
                {navLinks.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2   transition-colors duration-200 ${
                                isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`
                        }
                    >
                        {icon}
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;

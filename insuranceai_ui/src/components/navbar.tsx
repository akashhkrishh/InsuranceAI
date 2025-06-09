import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../public/logo.png";


import { FiFileText, FiShield, FiBookOpen, FiLayout} from "react-icons/fi";

const navLinks = [
    { to: "/", label: "Home", icon: <FiLayout size={18} /> },
    { to: "/document-analysis", label: "AI Document Analyze", icon: <FiBookOpen size={18} /> },
    { to: "/risk-assessment", label: "Risk Assessment", icon: <FiShield size={18} /> },
    { to: "/policy", label: "Policy Comparison", icon: <FiFileText size={18} /> },
    { to: "/claim-assistant", label: "Claim Assistant", icon: <FiFileText size={18} /> },
];


const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 inset-x-0 border-b border-slate-300 bg-white">
            <nav className="px-8 md:px-20 flex items-center justify-between ">
                <div className="flex  select-none items-center gap-2" aria-label="Go to home page">
                    <img
                        src={Logo}
                        alt="Insurance AI Logo"
                        className="h-10 w-10 object-contain"
                        loading="lazy"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-[#307DE3] text-xl font-semibold">Insurance AI</h1>
                </div>

                <div className="flex items-center text-md  justify-end h-full space-x-4 ">

                    <div className="hidden md:flex space-x-6 pt-5 ">
                        {navLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `px-2 pb-5 flex items-center justify-center gap-2  ${
                                        isActive ? "text-blue-600 border-b-2 transition-all duration-500 ease-in-out  " : "text-gray-700 hover:text-black border-b-2 border-transparent"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                </div>

            </nav>
        </header>
    );
};

export default Navbar;

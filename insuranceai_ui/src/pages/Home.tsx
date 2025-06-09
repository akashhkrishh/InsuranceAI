import { useState } from "react";
import Logo from "../../public/logo.png";
import RiskImage from "../assets/risk assessment.png";
import PolicyImage from "../assets/policy compare.png";
import DocumentImage from "../assets/pdf.png";
import ClaimImage from "../assets/claim.png";
import { NavLink } from "react-router-dom";
import ChatBot from "./ChatBot";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full flex items-center justify-center h-full">
            <div className="grid grid-cols-5 gap-6 max-w-6xl ">
                <NavLink
                    to="/document-analysis"
                    className="w-full aspect-square max-w-[250px] p-4 border flex flex-col items-center justify-center gap-2 bg-white hover:scale-105 transition duration-300 cursor-pointer"
                >
                    <img
                        src={DocumentImage}
                        alt="Chat AI Icon"
                        className="w-20 h-20 p-2"
                    />
                    <div className={"flex items-center justify-center flex-col gap-1"}>
                        <h2 className="text-lg font-semibold text-gray-800">Analyze Documents</h2>
                        <p className="text-xs text-gray-500 text-center">
                            Extract key insights and summaries with AI
                        </p>
                    </div>
                </NavLink>

                <NavLink
                    to="/policy"
                    className="w-full aspect-square max-w-[250px] p-4 border flex flex-col items-center justify-center gap-2 bg-white hover:scale-105 transition duration-300 cursor-pointer"
                >
                    <img src={PolicyImage} alt="Chat AI Icon" className="w-20 h-20 p-2" />
                    <div className={"flex items-center justify-center flex-col gap-1"}>
                        <h2 className="text-lg font-semibold text-gray-800">Compare Policy</h2>
                        <p className="text-xs text-gray-500 text-center">
                            Quickly compare coverage, premiums & benefits
                        </p>
                    </div>
                </NavLink>

                <NavLink
                    to="/claim-assistant"
                    className="w-full aspect-square max-w-[250px] p-4 border flex flex-col items-center justify-center gap-2 bg-white hover:scale-105 transition duration-300 cursor-pointer"
                >
                    <img src={ClaimImage} alt="Chat AI Icon" className="w-20 h-20 p-2" />
                    <div className={"flex items-center justify-center flex-col gap-1"}>
                        <h2 className="text-lg font-semibold text-gray-800">Claim Assistant</h2>
                        <p className="text-xs text-gray-500 text-center">
                            Get step-by-step help with filing your insurance claims using AI.
                        </p>
                    </div>
                </NavLink>

                <NavLink
                    to="/risk-assessment"
                    className="w-full aspect-square max-w-[250px] p-4 border flex flex-col items-center justify-center gap-2 bg-white hover:scale-105 transition duration-300 cursor-pointer"
                >
                    <img src={RiskImage} alt="Chat AI Icon" className="w-20 h-20 p-2" />
                    <div className={"flex items-center justify-center flex-col"}>
                        <h2 className="text-lg font-semibold text-gray-800">Risk Assessment</h2>
                        <p className="text-xs text-gray-500 text-center">
                            AI-driven personal insurance risk analysis
                        </p>
                    </div>
                </NavLink>
                <div
                    onClick={()=>setIsOpen(!isOpen)}
                    className="w-full aspect-square max-w-[250px] p-4 border flex flex-col items-center justify-center gap-2 bg-white hover:scale-105 transition duration-300 cursor-pointer"
                >
                    <img src={Logo} alt="Chat AI Icon" className="w-20 h-20 p-1" />
                    <div className={"flex items-center justify-center flex-col gap-1"}>
                        <h2 className="text-lg font-semibold text-gray-800">Talk to Chat AI</h2>
                        <p className="text-xs text-gray-500 text-center">
                            Get instant help, answers, and suggestions powered by AI.
                        </p>
                    </div>
                </div>

                {isOpen &&
                    <ChatBot onClick={() => setIsOpen(false)} />
                }


            </div>
        </div>
    );
};

export default Home;


import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home.tsx";
import PolicyComparison from "./pages/PolicyComparison.tsx";
import ClaimAssistant from "./pages/ClaimAssistant.tsx";
import RiskAssessment from "./pages/RiskAssessment.tsx";
import ChatBot from "./pages/ChatBot.tsx";
import DocumentAnalysis from "./pages/DocumentAnalysis.tsx";
import Logo from  "../public/logo.png"
import React from "react";

function App() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (

            <div className="h-screen w-screen overflow-y-auto flex flex-col">
                <Navbar />

                <main className="flex-1 px-8 md:px-20 flex relative">

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/policy" element={<PolicyComparison />} />
                        <Route path="/claim-assistant" element={<ClaimAssistant />} />
                        <Route path="/risk-assessment" element={<RiskAssessment />} />
                        <Route path="/document-analysis" element={<DocumentAnalysis />} />
                    </Routes>
                    {
                        !isOpen ?
                            <div onClick={()=>setIsOpen(!isOpen)} className={"absolute  z-40 duration-500 bottom-14 hover:scale-105 transition-all ease-in-out   select-none gap-1 right-14 flex flex-col items-center justify-center"}>
                                <div className={" aspect-square cursor-pointer bg-white rounded-full h-[60px] border border-slate-300 "}>
                                    <img src={Logo} alt="Logo" className={"absolute p-3"}/>
                                </div>
                                <span className={"font-semibold text-sm bg-white"}>Chat AI</span>
                            </div>
                            :
                            <ChatBot onClick={() => setIsOpen(false)} />
                    }
                </main>
            </div>

    );
}

export default App;

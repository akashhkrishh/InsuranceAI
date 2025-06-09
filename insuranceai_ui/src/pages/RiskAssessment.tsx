import React, { useState } from "react";
import MultiForm from "../components/MultiForm.tsx";

const RiskAssessment: React.FC = () => {
    const [isStart, setStart] = useState(false);

    return (
        <div className={"flex-1 transition-all duration-300 ease-in-out h-full w-full flex items-center justify-center"}>
            {isStart ? (
                <div className="h-full w-full flex py-16 justify-center ">
                    <MultiForm/>
                </div>
            ) : (
                <button
                    className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-500  h-fit text-white "
                    onClick={() => setStart(true)}
                >
                    Start Risk Assessment
                </button>
            )}
        </div>
    );
};

export default RiskAssessment;

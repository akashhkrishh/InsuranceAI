import React, { useState, useEffect } from "react";
import axios from "axios";

const MultiStepForm: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (Object.keys(answers).length === 0) {
            fetchQuestion({});
        }
    }, []);


    const fetchQuestion = async (currentAnswers: Record<number, string>) => {
        try {
            const res = await axios.post("http://localhost:5000/api/risk/ask", {
                answers: currentAnswers,
            });

            if (res.data.done) {
                setResult(res.data.llm_response);
            } else {
                setCurrentQuestion(res.data.question);
                setCurrentStep(Object.keys(currentAnswers).length);
            }
        } catch (err) {
            console.error("Error fetching question", err);
            alert("Failed to load next question.");
        }
    };

    const handleNext = async () => {
        if (!inputValue.trim()) {
            alert("Please answer before proceeding.");
            return;
        }

        const updatedAnswers = { ...answers, [currentStep]: inputValue.trim() };
        setAnswers(updatedAnswers);
        setInputValue("");
        setIsSubmitting(true);
        await fetchQuestion(updatedAnswers);
        setIsSubmitting(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleNext();
        }
    };

    if (result) {
        return (
            <div className="mx-auto max-w-2xl bg-white  ">
                <h2 className="text-4xl font-semibold mb-4">Risk Assessment Result</h2>

                <p className="text-lg">
                    <strong className={"text-blue-500 font-semibold"}>Risk Score:</strong>{" "}
                    <span
                        className={`font-semibold ${
                            result.risk_score === "High"
                                ? "text-red-500"
                                : result.risk_score === "Low"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                        }`}
                    >
                    {result.risk_score}
                </span>
                </p>

                <p className="mt-2 text-base">
                    <strong className={"text-blue-500 font-semibold text-lg text-justify"}>Summary:</strong> {result.summary}
                </p>

                {result.suggestions?.length > 0 && (
                    <div className="mt-4">
                        <strong className={"text-blue-500 text-lg font-semibold"}>Suggestions:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            {result.suggestions.map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }


    return (
        <div className="flex items-center justify-center px-4 w-full  relative">
            <div className="w-full flex items-center  flex-col  bg-white p-8  ">
                <div className={"flex flex-col"}>
                    <div className="w-[500px]  bg-gray-200 h-2 mb-6 ">
                        <div
                            className="bg-blue-500 h-2  transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
                        />
                    </div>

                    <p className="mb-4 text-lg font-medium">
                        {currentStep + 1}. {currentQuestion}
                    </p>
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your Answer"
                    className="w-[500px] border border-gray-300 p-3 focus:outline-blue-500 "
                    disabled={isSubmitting}
                />

                <div className="flex justify-end w-[500px]  mt-6">
                    <button
                        type="button"
                        onClick={handleNext}
                        className={`px-6 py-2 text-white  ${
                            isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={isSubmitting}
                    >
                        {currentStep === 5 ? "Submit" : "Next"}
                    </button>
                </div>

                {isSubmitting && (
                    <div className="absolute inset-0 w-full bg-white/75 flex items-center justify-center flex-1 z-10">
                        <div className="flex items-center justify-center space-x-3 w-screen">
                            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-blue-600 font-medium">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiStepForm;

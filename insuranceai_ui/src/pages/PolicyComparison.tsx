import React, { useState } from "react";
import axios from "axios";

const availablePolicies = [
    { id: "POL001", name: "POL001 - ABC Health Family Health Insurance" },
    { id: "POL002", name: "POL002 - SecureLife Term Life Insurance" },
    { id: "POL003", name: "POL003 - HealthMax Individual Health Insurance" },
    { id: "POL004", name: "POL004 - CarePlus Senior Citizen Health Insurance" },
];

type AIComparison = {
    comparison_summary: string;
    coverage_gaps: string[];
    policy_comparison: {
        policy_id: string;
        strengths: string[];
        weaknesses: string[];
    }[];
    recommendations: string[];
    recommended_policy_id: string;
};

const PolicyComparison: React.FC = () => {
    const [selectedPolicy, setSelectedPolicy] = useState("POL001");
    const [excludedPolicy, setExcludedPolicy] = useState("POL004");

    const [age, setAge] = useState<number | undefined>(25);
    const [familySize, setFamilySize] = useState<number | undefined>(4);
    const [budget, setBudget] = useState<number | undefined>(10000);
    const [healthConditions, setHealthConditions] = useState("diabets");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [aiSummary, setAiSummary] = useState<AIComparison | null>(null);

    const includedPolicyOptions = availablePolicies.filter(
        (p) => p.id !== excludedPolicy
    );
    const excludedPolicyOptions = availablePolicies.filter(
        (p) => p.id !== selectedPolicy
    );

    const handleSubmit = async () => {
        setError(null);
        setAiSummary(null);
        setLoading(true);

        if (!selectedPolicy || !excludedPolicy) {
            alert("Please select both policies.");
            setLoading(false);
            return;
        }
        if (
            age === undefined ||
            familySize === undefined ||
            budget === undefined ||
            age < 0 ||
            familySize < 1 ||
            budget < 0
        ) {
            alert("Please enter valid input values.");
            setLoading(false);
            return;
        }

        const policies = [selectedPolicy, excludedPolicy];

        const userProfile = {
            age,
            family_size: familySize,
            budget,
            health_conditions: healthConditions
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c.length > 0),
        };

        const payload = {
            policies,
            user: userProfile,
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/policy_compare/compare",
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response) {
                throw new Error(`Server error: ${response}`);
            }

            setAiSummary(response.data.ai_summary);
            console.log(response.data.ai_summary);
        } catch (error: any) {
            console.error(error);
            setError("Failed to fetch comparison results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getPolicyName = (id: string) =>
        availablePolicies.find((p) => p.id === id)?.name || id;

    return (
        <div className="flex flex-col md:flex-row w-full   gap-4 p-4">

            <div
                className="flex flex-col md:w-1/3 border border-slate-300  p-4 h-[600px] overflow-y-auto space-y-4"
                style={{ minWidth: 280 }}
            >
                <h2 className="text-xl font-bold mb-4">Input Details</h2>

                <div>
                    <label
                        htmlFor="selectPolicy"
                        className="block font-semibold mb-1"
                    >
                        Select Policy to Include
                    </label>
                    <select
                        id="selectPolicy"
                        value={selectedPolicy}
                        onChange={(e) => setSelectedPolicy(e.target.value)}
                        className="w-full border border-gray-300  px-2 py-1"
                    >
                        <option value="">-- Select a policy --</option>
                        {includedPolicyOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="excludePolicy"
                        className="block font-semibold mb-1"
                    >
                        Select Policy to Exclude
                    </label>
                    <select
                        id="excludePolicy"
                        value={excludedPolicy}
                        onChange={(e) => setExcludedPolicy(e.target.value)}
                        className="w-full border border-gray-300  px-2 py-1"
                    >
                        <option value="">-- Select a policy --</option>
                        {excludedPolicyOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="ageInput">
                        Age
                    </label>
                    <input
                        id="ageInput"
                        type="number"
                        className="w-full border border-gray-300  px-2 py-1"
                        value={age ?? ""}
                        onChange={(e) => setAge(Number(e.target.value))}
                        min={0}
                    />
                </div>

                <div>
                    <label
                        className="block font-semibold mb-1"
                        htmlFor="familySizeInput"
                    >
                        Family Size
                    </label>
                    <input
                        id="familySizeInput"
                        type="number"
                        className="w-full border border-gray-300  px-2 py-1"
                        value={familySize ?? ""}
                        onChange={(e) => setFamilySize(Number(e.target.value))}
                        min={1}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="budgetInput">
                        Budget (₹)
                    </label>
                    <input
                        id="budgetInput"
                        type="number"
                        className="w-full border border-gray-300  px-2 py-1"
                        value={budget ?? ""}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        min={0}
                    />
                </div>

                <div>
                    <label
                        className="block font-semibold mb-1"
                        htmlFor="healthConditionsInput"
                    >
                        Health Conditions (comma separated)
                    </label>
                    <input
                        id="healthConditionsInput"
                        type="text"
                        className="w-full border border-gray-300  px-2 py-1"
                        value={healthConditions}
                        onChange={(e) => setHealthConditions(e.target.value)}
                        placeholder="e.g. none, diabetes"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-auto bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2  disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Comparing..." : "Compare Policies"}
                </button>

                {error && (
                    <p className="text-red-600 mt-2 font-semibold" role="alert">
                        {error}
                    </p>
                )}
            </div>
            <div className="md:w-2/3 flex flex-col h-[600px] gap-4">

                <div className="flex flex-col border border-slate-300  p-4 overflow-y-auto h-[290px]">
                    {loading ? (
                        <p>Loading comparison results...</p>
                    ) : aiSummary ? (
                        <>
                            {aiSummary.recommended_policy_id && (
                                <div className="mb-2  pb-4 border-b flex  items-end  gap-2 border-gray-300">
                                    <h3 className="text-lg font-semibold text-blue-500">Recommended Policy:</h3>
                                    <p className="text-green-500 text-2xl font-semibold">
                                        {getPolicyName(aiSummary.recommended_policy_id)}
                                    </p>
                                </div>
                            )}
                            <h2 className="text-lg font-semibold mb-2 text-blue-500">Comparison Summary</h2>
                            <p className="mb-4">{aiSummary.comparison_summary}</p>
                            <h2 className="text-lg font-semibold mb-2 text-blue-500">Coverage Gap</h2>

                            {aiSummary.coverage_gaps.map((item, i) => {
                                return <li key={i}>{item}</li>;
                            })}

                            <h2 className="text-lg font-semibold text-blue-500 my-2">Recommendations</h2>

                            {aiSummary.recommendations.map((item, i) => {
                                return <li key={i}>{item}</li>;
                            })}

                        </>
                    ) : (
                        <p>No comparison summary available yet.</p>
                    )}
                </div>

                <div className="flex gap-4 overflow-y-auto h-[300px]">
                    {loading ? (
                        <>
                            <div className="border border-slate-300 p-4  flex-1">
                                <p>Loading policy details...</p>
                            </div>
                            <div className="border border-slate-300 p-4  flex-1">
                                <p>Loading policy details...</p>
                            </div>
                        </>
                    ) : aiSummary ? (
                        aiSummary.policy_comparison.map((policy) => (
                            <div
                                key={policy.policy_id}
                                className="border border-slate-300 p-4  flex-1 overflow-auto"
                            >
                                <h3 className="text-lg font-bold mb-2">
                                    {getPolicyName(policy.policy_id)}
                                </h3>
                                <div>
                                    <h4 className="font-semibold">Strengths:</h4>
                                    <ul className="list-disc list-inside mb-3 text-green-600 max-h-40 overflow-auto">
                                        {policy.strengths.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Weaknesses:</h4>
                                    <ul className="list-disc list-inside text-red-600 max-h-40 overflow-auto">
                                        {policy.weaknesses.map((w, i) => (
                                            <li key={i}>{w}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="border border-slate-300 p-4  flex-1">
                                <p>No policy details to show.</p>
                            </div>
                            <div className="border border-slate-300 p-4  flex-1">
                                <p>No policy details to show.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PolicyComparison;

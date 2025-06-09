import React, { useState } from "react";
import axios from "axios";

const availablePolicies = [
    { id: "POL001", name: "POL001 - ABC Health Family Health Insurance" },
    { id: "POL002", name: "POL002 - SecureLife Term Life Insurance" },
    { id: "POL003", name: "POL003 - HealthMax Individual Health Insurance" },
    { id: "POL004", name: "POL004 - CarePlus Senior Citizen Health Insurance" },
];

interface ClaimProcess {
    steps: string[];
    required_documents: string[];
}

interface ClaimData {
    policy_id: string;
    provider: string;
    plan_type: string;
    claim_process: ClaimProcess;
    simple_explanation: string;
}

const ClaimAssistant: React.FC = () => {
    const [selectedPolicy, setSelectedPolicy] = useState<string>("");
    const [data, setData] = useState<ClaimData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFetch = async () => {
        if (!selectedPolicy) {
            alert("Please select a policy.");
            return;
        }

        setLoading(true);
        setError("");
        setData(null);

        try {
            const res = await axios.get(`http://localhost:5000/api/claims/${selectedPolicy}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load claim process.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 h-full bg-white py-4  grid grid-cols-3 gap-4">
            <div className={"h-full border col-span-1 p-4"}>
                <div className="grid md:grid-cols-1 gap-6 w-full">
                    <div>
                        <label className="block text-lg font-medium mb-2 w-full">Select a Policy:</label>
                        <select
                            value={selectedPolicy}
                            onChange={(e) => setSelectedPolicy(e.target.value)}
                            className="w-full border border-gray-300 p-3 "
                        >
                            <option value="">-- Choose Policy --</option>
                            {availablePolicies.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <button
                            disabled={loading}
                            onClick={handleFetch}
                            className={`mt-4 w-full px-6 py-2 rounded text-white transition 
    ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                        >
                            {loading ? "Loading..." : "View Claim Process"}
                        </button>

                    </div>

                    <div className="flex items-center">
                        {loading && <p className="text-blue-500">Fetching claim process...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </div>

            </div>
            <div className={"max-h-[86vh] h-full border col-span-2 p-4 overflow-y-auto"}>
                {!data && !loading && !error && (
                    <div className="col-span-2 mt-2 text-gray-600  text-lg">
                        Please select a policy and click <strong className={"font-semibold"}>“View Claim Process”</strong> to continue.
                    </div>
                )}


                {data && (
                    <div className=" ">
                        <h3 className="text-2xl font-semibold mb-4">{data.plan_type}</h3>
                        <p className="mb-1">
                            <strong className="text-blue-600 font-semibold">Provider:</strong> {data.provider}
                        </p>
                        <p className="mb-4">
                            <strong className="text-blue-600 font-semibold">Policy ID:</strong> {data.policy_id}
                        </p>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-blue-600 mb-2">Simple Explanation</h4>
                            <p className="text-base">{data.simple_explanation}</p>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-blue-600 mb-2">Claim Steps</h4>
                            <ol className="list-decimal pl-5 space-y-1">
                                {data.claim_process.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold text-blue-600 mb-2">Required Documents</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {data.claim_process.required_documents.map((doc, i) => (
                                    <li key={i}>{doc}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default ClaimAssistant;

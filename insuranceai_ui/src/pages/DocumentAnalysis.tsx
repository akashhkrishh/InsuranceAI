import { useState } from "react";
import FileDropzone from "../components/FileDropZone.tsx";
import axios from "axios";

type SummaryType = {
    coverage_details: string;
    premium_and_deductible: string;
    claims_process: string;
    exclusions: string[];
    benefits: string[];
};

type RawSummaryType = {
    coverage_details: string;
    premium_and_deductible: string;
    claims_process: string;
    exclusions: string | string[];
    benefits: string | string[];
};

const normalizeToArray = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value;

    const splitItems = value
        .split(/;|\n|,/)
        .map(s => s.trim())
        .filter(Boolean);

    if (splitItems.length === 1 && !/[;,]/.test(value)) {
        return [value.trim()];
    }

    return splitItems;
};

const DocumentAnalysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState<SummaryType | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:5000/api/document/analyze",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // if (response.data.error) {
            //     alert("❌ " + response.data.error);
            //     console.log("Raw Response:", response.data.summary_raw ?? "No raw summary");
            //     setSummary(null);
            //     return;
            // }

            const raw: string = response.data.summary_raw ?? JSON.stringify(response.data.summary);
            const jsonStart = raw.indexOf("{");
            if (jsonStart === -1) throw new Error("No JSON object found in response.");

            const jsonString = raw.slice(jsonStart);
            const rawParsed: RawSummaryType = JSON.parse(jsonString);

            const exclusions = normalizeToArray(rawParsed.exclusions);
            const benefits = normalizeToArray(rawParsed.benefits);

            const premium_and_deductible = rawParsed.premium_and_deductible?.trim() || "Not specified.";

            const normalizedSummary: SummaryType = {
                coverage_details: rawParsed.coverage_details || "Not specified.",
                premium_and_deductible,
                claims_process: rawParsed.claims_process || "Not specified.",
                exclusions,
                benefits,
            };

            setSummary(normalizedSummary);
        } catch (error: any) {
            console.error("Document analysis error:", error);
            alert("❌ " + (error.error || error.message || "Failed to analyze document."));
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const renderSummary = () => {
        if (!summary) return null;

        return (
            <div className="space-y-4 overflow-y-auto h-full">
                <section>
                    <h2 className="font-semibold text-lg text-blue-600">Coverage Details</h2>
                    <p>{summary.coverage_details}</p>
                </section>

                <section>
                    <h2 className="font-semibold text-lg text-blue-600">Premium & Deductible</h2>
                    <p>{summary.premium_and_deductible}</p>
                </section>

                <section>
                    <h2 className="font-semibold text-lg text-blue-600">Claims Process</h2>
                    <p>{summary.claims_process}</p>
                </section>

                <section>
                    <h2 className="font-semibold text-lg text-blue-600">Exclusions</h2>
                    {summary.exclusions.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {summary.exclusions.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No exclusions specified.</p>
                    )}
                </section>

                <section>
                    <h2 className="font-semibold text-lg text-blue-600">Benefits</h2>
                    {summary.benefits.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {summary.benefits.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No benefits specified.</p>
                    )}
                </section>
            </div>
        );
    };

    return (
        <div className="py-4 w-full grid grid-cols-7 gap-4" style={{ height: "90vh" }}>

            <div className="flex flex-col col-span-2 gap-2 h-fit">
                <h1 className="text-xl font-semibold pb-4">Upload Policy Document</h1>
                <FileDropzone onFileSelect={setFile} />
                <button
                    className="w-full bg-blue-500 py-2 text-white cursor-pointer disabled:opacity-50"
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>


            <div
                className="flex flex-col col-span-5 border border-slate-300 p-4 overflow-y-auto h-full"
                style={{ maxHeight: "100vh" }}
            >
                {summary ? (
                    renderSummary()
                ) : (
                    <p className="text-gray-400">No summary yet. Upload a file and click Analyze.</p>
                )}
            </div>
        </div>
    );
};

export default DocumentAnalysis;

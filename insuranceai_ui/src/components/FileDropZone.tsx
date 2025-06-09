import React, { useRef, useState } from "react";

const FileDropzone: React.FC = () => {
    const [previewName, setPreviewName] = useState<string | null>(null);
    const dropzoneRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dropzoneRef.current?.classList.add("border-indigo-600");
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dropzoneRef.current?.classList.remove("border-indigo-600");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dropzoneRef.current?.classList.remove("border-indigo-600");
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            displayPreview(file);
        } else {
            alert("Only PDF files are allowed.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            displayPreview(file);
        } else {
            alert("Only PDF files are allowed.");
        }
    };

    const displayPreview = (file: File) => {
        setPreviewName(file.name);
    };

    return (
        <div
            ref={dropzoneRef}
            className="w-full  relative border-2 border-gray-300 border-dashed p-6"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                name="file-upload"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                onChange={handleFileChange}
            />

            {!previewName &&
            <div className="text-center pointer-events-none">

                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    <label htmlFor="file-upload" className="relative cursor-pointer">
                        <span>Drag and drop</span>
                        <span className="text-indigo-600"> or browse</span>
                        <span> to upload</span>
                    </label>
                </h3>
                <p className="mt-1 text-xs text-gray-500">PDF up to 10MB</p>
            </div>
            }

            {previewName && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-700">📄 {previewName}</p>
                </div>
            )}
        </div>
    );
};

export default FileDropzone;

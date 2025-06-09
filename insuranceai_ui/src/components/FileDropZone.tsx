import React, { useRef, useState } from "react";

interface FileDropzoneProps {
    onFileSelect: (file: File | null) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect }) => {
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
        validateAndPreview(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        validateAndPreview(file);
    };

    const validateAndPreview = (file?: File) => {
        if (!file) return;
        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }
        setPreviewName(file.name);
        onFileSelect(file);
    };

    return (
        <div
            ref={dropzoneRef}
            className="w-full relative border-2 border-gray-300 border-dashed flex items-center justify-center p-6 h-[200px] "
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                onChange={handleFileChange}
            />

            {!previewName ? (
                <div className="text-center pointer-events-none">
                    <h3 className="text-sm font-medium text-gray-700">
                        <span>Drag and drop</span>
                        <span className="text-indigo-600 font-semibold"> or browse </span>
                        <span>to upload</span>
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">Only PDF files, max 10MB</p>
                </div>
            ) : (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-800 font-medium">📄 {previewName}</p>
                </div>
            )}
        </div>
    );
};

export default FileDropzone;

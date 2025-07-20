import React, { useState } from "react";
import Upload from '../../assets/images/uploadimage.svg';

interface DragDropUploaderProps {
    onFilesSelected: (files: File[]) => void;
    width?: string;
    height?: string;
}

const DragDropUploader: React.FC<DragDropUploaderProps> = ({
    onFilesSelected,
    width = "100%",
    height = "150px"
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
        onFilesSelected([...files, ...droppedFiles]);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
        setFiles(prev => [...prev, ...selectedFiles]);
        onFilesSelected([...files, ...selectedFiles]);
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    return (
        <div
            style={{ width, height, border: "2px dashed #c2c2c2ff", borderRadius: "8px", background: isDragging ? "#fee2e2" : "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex flex-col items-center justify-center font-poppins"
        >
            <img src={Upload} className="w-10 h-10 mb-2" alt="Upload Icon" />
            <p className="text-center text-gray-400">Drag & drop files here or <label style={{ color: "#f87171", cursor: "pointer" }} htmlFor="file-upload">browse</label></p>
            <input
                id="file-upload"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <ul style={{ marginTop: "10px", width: "90%" }}>
                {files.map((file, idx) => (
                    <li key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                        {file.name}
                        <button type="button" style={{ color: "#f87171", marginLeft: "10px" }} onClick={() => handleRemoveFile(idx)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DragDropUploader;
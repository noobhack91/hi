import React, { useState } from 'react';

interface FileUploadProps {
    visit: any;
    onSelect: (fileContent: string, visit: any, fileName: string, fileType: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ visit, onSelect }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target) {
                        onSelect(e.target.result as string, visit, file.name, file.type);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    return (
        <input type="file" onChange={handleFileChange} />
    );
};

export default FileUpload;

"use client";
import { UploadIcon } from "@/app/icons";
import { useEffect, useState } from "react";

const CustomFileInput = ({ name, defaultValue, required }) => {
  const [fileName, setFileName] = useState("No file chosen");

  useEffect(() => {
    if (defaultValue) {
      const parts = defaultValue.split("/");
      setFileName(parts[parts.length - 1]);
    }
  }, [defaultValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "No file chosen");
  };

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
      <input
        type="file"
        name={name}
        className="sr-only"
        id="fileInput"
        onChange={handleFileChange}
        required={required}
      />
      <label
        htmlFor="fileInput"
        className="custom-input flex items-center gap-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 w-fit"
      >
        <UploadIcon />
        Choose File
      </label>
      <span className="ml-3 text-gray-600 truncate">{fileName}</span>
    </div>
  );
};

export default CustomFileInput;

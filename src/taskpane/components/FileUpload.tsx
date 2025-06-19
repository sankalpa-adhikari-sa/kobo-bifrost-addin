import { Input } from "@fluentui/react-components";
import { AttachRegular } from "@fluentui/react-icons";
import { useState, useRef, ChangeEvent, MouseEvent } from "react";

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleInputClick = (event: MouseEvent<HTMLInputElement>): void => {
    event.preventDefault();
    handleFileButtonClick();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
      <div style={{ position: "relative" }}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{
            position: "absolute",
            opacity: 0,
            width: "100%",
            height: "100%",
            cursor: "pointer",
            zIndex: 1,
          }}
          aria-label="File upload"
        />
        <Input
          value={selectedFile?.name || ""}
          placeholder="Choose a file..."
          readOnly
          contentAfter={<AttachRegular />}
          style={{ cursor: "pointer", width: "100%", height: "100%" }}
          onClick={handleInputClick}
          aria-label="File input display"
        />
      </div>
    </div>
  );
};

export default FileUpload;

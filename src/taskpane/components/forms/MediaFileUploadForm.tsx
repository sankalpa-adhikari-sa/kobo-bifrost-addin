import { Control, FieldErrors, useController } from "react-hook-form";
import { Input, Field, Button, ProgressBar, Badge, Text } from "@fluentui/react-components";
import {
  AttachRegular,
  DeleteRegular,
  DocumentRegular,
  ArrowClockwiseRegular,
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";

interface FileUploadState {
  id: string;
  name: string;
  base64: string;
  size: number;
  type: string;
  status: "pending" | "uploading" | "success" | "error";
  progress?: number;
  error?: string;
}

interface MediaUploadFormData {
  files: FileUploadState[];
}

interface MediaFileUploadFormProps {
  control: Control<MediaUploadFormData>;
  errors: FieldErrors<MediaUploadFormData>;
  isLoading: boolean;
  onFilesChange?: (files: FileUploadState[]) => void;
  onRetryFile?: (fileId: string) => void;
}

export const MediaFileUploadForm = ({
  control,
  errors,
  isLoading,
  onFilesChange,
  onRetryFile,
}: MediaFileUploadFormProps) => {
  const {
    field: { value: selectedFiles, onChange: onFormChange },
  } = useController({
    name: "files",
    control,
    defaultValue: [],
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const generateFileId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelection = async (files: FileList) => {
    const newFiles: FileUploadState[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64 = await convertToBase64(file);
        newFiles.push({
          id: generateFileId(),
          name: file.name,
          base64,
          size: file.size,
          type: file.type,
          status: "pending",
        });
      } catch (error) {
        console.error(`Error converting ${file.name} to base64:`, error);
        newFiles.push({
          id: generateFileId(),
          name: file.name,
          base64: "",
          size: file.size,
          type: file.type,
          status: "error",
          error: "Failed to process file",
        });
      }
    }
    const updatedFiles = [...selectedFiles, ...newFiles];
    onFormChange(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.id !== fileId);
    onFormChange(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const clearAllFiles = () => {
    onFormChange([]);
    onFilesChange?.([]);
  };

  const retryFile = (fileId: string) => {
    const updatedFiles = selectedFiles.map((file) =>
      file.id === fileId
        ? { ...file, status: "pending" as const, error: undefined, progress: undefined }
        : file
    );
    onFormChange(updatedFiles);
    onFilesChange?.(updatedFiles);

    if (onRetryFile) {
      setTimeout(() => onRetryFile(fileId), 0);
    }
  };
  const totalFiles = selectedFiles.length;
  const successfulFiles = selectedFiles.filter((f) => f.status === "success").length;
  const failedFiles = selectedFiles.filter((f) => f.status === "error").length;
  const uploadingFiles = selectedFiles.filter((f) => f.status === "uploading").length;
  const pendingFiles = selectedFiles.filter((f) => f.status === "pending").length;
  const overallProgress = totalFiles > 0 ? (successfulFiles / totalFiles) * 100 : 0;

  const getStatusIcon = (status: FileUploadState["status"]) => {
    switch (status) {
      case "success":
        return <CheckmarkCircleRegular className="text-green-600" />;
      case "error":
        return <ErrorCircleRegular className="text-red-600" />;
      case "uploading":
        return <DocumentRegular className="text-blue-600 animate-pulse" />;
      default:
        return <DocumentRegular className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <Field
        label="Media Files"
        validationState={errors.files ? "error" : undefined}
        validationMessage={errors.files?.message as string}
      >
        <div style={{ position: "relative" }}>
          <input
            type="file"
            accept=".png,.csv,.jpg,.jpeg,.pdf,.doc,.docx"
            multiple
            onChange={async (e) => {
              if (e.target.files && e.target.files.length > 0) {
                await handleFileSelection(e.target.files);
              }
            }}
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
              zIndex: 1,
            }}
            aria-label="Multiple file upload"
            disabled={isLoading}
          />
          <Input
            placeholder={
              selectedFiles.length > 0
                ? `${selectedFiles.length} file(s) selected`
                : "Choose media files..."
            }
            readOnly
            contentAfter={<AttachRegular />}
            style={{ cursor: "pointer", width: "100%", height: "100%" }}
            disabled={isLoading}
          />
        </div>
      </Field>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Text weight="semibold" size={300}>
                Upload Progress
              </Text>
              <Text size={200} className="text-gray-600">
                {successfulFiles}/{totalFiles} completed
              </Text>
            </div>
            <ProgressBar value={overallProgress} max={100} className="mb-2" />
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {successfulFiles} successful • {failedFiles} failed • {uploadingFiles} uploading •{" "}
                {pendingFiles} pending
              </span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="flex gap-2">
              {failedFiles > 0 && !isLoading && (
                <Button
                  size="small"
                  appearance="subtle"
                  onClick={() => {
                    selectedFiles.forEach((file) => {
                      if (file.status === "error") {
                        retryFile(file.id);
                      }
                    });
                  }}
                  disabled={isLoading}
                  icon={<ArrowClockwiseRegular />}
                >
                  Retry Failed ({failedFiles})
                </Button>
              )}
              <Button size="small" appearance="subtle" onClick={clearAllFiles} disabled={isLoading}>
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  file.status === "success"
                    ? "border-green-200 bg-green-50"
                    : file.status === "error"
                      ? "border-red-200 bg-red-50"
                      : file.status === "uploading"
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <Badge
                        appearance={
                          file.status === "success"
                            ? "filled"
                            : file.status === "error"
                              ? "tint"
                              : file.status === "uploading"
                                ? "outline"
                                : "filled"
                        }
                        color={
                          file.status === "success"
                            ? "success"
                            : file.status === "error"
                              ? "danger"
                              : file.status === "uploading"
                                ? "warning"
                                : undefined
                        }
                        size="small"
                      >
                        {file.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                    {file.status === "uploading" && file.progress !== undefined && (
                      <ProgressBar value={file.progress} max={100} className="mt-1" />
                    )}
                    {file.status === "error" && file.error && (
                      <p className="text-xs text-red-600 mt-1">{file.error}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {file.status === "error" && !isLoading && (
                    <Button
                      size="small"
                      appearance="subtle"
                      icon={<ArrowClockwiseRegular />}
                      onClick={() => retryFile(file.id)}
                      disabled={isLoading}
                      aria-label={`Retry ${file.name}`}
                    />
                  )}
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<DeleteRegular />}
                    onClick={() => removeFile(file.id)}
                    disabled={isLoading || file.status === "uploading"}
                    aria-label={`Remove ${file.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

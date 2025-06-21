import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ReusableDialog } from "./ReusableDialog";
import { useImportMediaFromFile } from "../../hooks/useMedia";
import { MediaFileUploadForm } from "../forms/MediaFileUploadForm";

interface MediaUploadProps {
  open: boolean;
  onClose: () => void;
  assetUid: string;
}

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

export const MediaUpload = ({ open, onClose, assetUid }: MediaUploadProps) => {
  const { mutate: mediaImportMutation } = useImportMediaFromFile();
  const [selectedFiles, setSelectedFiles] = useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MediaUploadFormData>({
    defaultValues: {
      files: [],
    },
  });

  const watchedFiles = watch("files");

  useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
      setIsUploading(false);
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (watchedFiles && watchedFiles.length !== selectedFiles.length) {
      setSelectedFiles(watchedFiles);
    }
  }, [watchedFiles]);

  const updateFileState = (fileId: string, updates: Partial<FileUploadState>) => {
    setSelectedFiles((prev) => {
      const updated = prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f));
      return updated;
    });
  };

  useEffect(() => {
    if (selectedFiles.length > 0 || watchedFiles?.length !== selectedFiles.length) {
      setValue("files", selectedFiles);
    }
  }, [selectedFiles, setValue]);

  const uploadFile = async (file: FileUploadState): Promise<void> => {
    return new Promise((resolve, reject) => {
      updateFileState(file.id, { status: "uploading", progress: 0, error: undefined });

      const progressInterval = setInterval(() => {
        setSelectedFiles((prev) => {
          const currentFile = prev.find((f) => f.id === file.id);
          if (
            currentFile &&
            currentFile.status === "uploading" &&
            (currentFile.progress || 0) < 90
          ) {
            const newProgress = Math.min((currentFile.progress || 0) + Math.random() * 20, 90);
            updateFileState(file.id, { progress: newProgress });
          }
          return prev;
        });
      }, 200);

      mediaImportMutation(
        {
          assetUid,
          payload: {
            file: file.base64,
            description: "default",
            file_type: "form_media",
            filename: file.name,
          },
        },
        {
          onSuccess: () => {
            clearInterval(progressInterval);
            updateFileState(file.id, { status: "success", progress: 100 });
            resolve();
          },
          onError: (error: any) => {
            clearInterval(progressInterval);
            updateFileState(file.id, {
              status: "error",
              error: error?.message || "Upload failed",
              progress: undefined,
            });
            reject(error);
          },
        }
      );
    });
  };

  const handleBulkUpload = async () => {
    const pendingFiles = selectedFiles.filter((file) => file.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];

      try {
        await uploadFile(file);
        successCount++;

        if (i < pendingFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setIsUploading(false);

    if (successCount === pendingFiles.length && successCount > 0) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleFilesChange = (files: FileUploadState[]) => {
    setSelectedFiles(files);
  };

  const handleRetryFile = async (fileId: string) => {
    if (isUploading) return;

    const fileToRetry = watchedFiles.find((f) => f.id === fileId);

    if (!fileToRetry) {
      console.error("Could not find the file to retry.");
      return;
    }

    try {
      await uploadFile(fileToRetry);
    } catch (error) {
      console.error(`Failed to retry upload for ${fileToRetry.name}:`, error);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    onClose();
  };

  const onSubmit = () => {
    handleBulkUpload();
  };

  const totalFiles = selectedFiles.length;
  const successfulFiles = selectedFiles.filter((f) => f.status === "success").length;
  const pendingFiles = selectedFiles.filter((f) => f.status === "pending").length;
  const failedFiles = selectedFiles.filter((f) => f.status === "error").length;

  const getSubmitButtonText = () => {
    if (isUploading) {
      return `Uploading... (${successfulFiles}/${totalFiles})`;
    }
    if (pendingFiles > 0) {
      return `Upload ${pendingFiles} File(s)`;
    }
    if (failedFiles > 0 && successfulFiles > 0) {
      return `${successfulFiles} Uploaded, ${failedFiles} Failed`;
    }
    if (successfulFiles === totalFiles && totalFiles > 0) {
      return "All Files Uploaded!";
    }
    return "Upload Files";
  };

  return (
    <ReusableDialog
      open={open}
      onClose={handleClose}
      title="Upload Media Files"
      onSubmit={handleSubmit(onSubmit)}
      submitText={getSubmitButtonText()}
      isLoading={isUploading}
    >
      <MediaFileUploadForm
        control={control}
        errors={errors}
        isLoading={isUploading}
        onFilesChange={handleFilesChange}
        onRetryFile={handleRetryFile}
      />
    </ReusableDialog>
  );
};

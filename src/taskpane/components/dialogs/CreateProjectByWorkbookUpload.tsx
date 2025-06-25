import { useState, useEffect } from "react";
import {
  useCreateProjectFromFile,
  ProjectCreationProgress,
  ProjectCreationError,
} from "../../hooks/useAssets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToastController, Toast, ToastTitle, ToastBody } from "@fluentui/react-components";
import {
  ProjectWorkbookUploadFormData,
  projectWorkbookUploadschema,
} from "../../../validators/schema";

import { ReusableDialog } from "./ReusableDialog";
import { ProjectWorkbookUploadForm } from "../forms/ProjectWorkbookUploadForm";

interface CreateXlsFormsProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
}

export const CreateXlsFormsByWorkbookUpload = ({
  open,
  onClose,
  toasterId,
}: CreateXlsFormsProps) => {
  const [progress, setProgress] = useState<ProjectCreationProgress | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectWorkbookUploadFormData>({
    resolver: zodResolver(projectWorkbookUploadschema),
  });

  const { dispatchToast } = useToastController(toasterId);
  const { mutate: createProjectMutation, isPending: isCreateProjectPending } =
    useCreateProjectFromFile();

  const handleClose = () => {
    if (isCreateProjectPending) return;
    reset({ name: "", base64Encoded: undefined });
    setProgress(null);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset({ name: "", base64Encoded: undefined });
      setProgress(null);
    }
  }, [open, reset]);

  const getStepSpecificErrorMessage = (error: ProjectCreationError) => {
    switch (error.step) {
      case "asset_creation":
        return "Failed to initialize project.";
      case "file_import":
        return "Failed to upload file.";
      case "status_check":
        return "File uploaded but processing failed.";
      default:
        return "An unexpected error occurred.";
    }
  };

  const onSubmit = (data: ProjectWorkbookUploadFormData) => {
    createProjectMutation(
      {
        base64Encoded: data.base64Encoded,
        name: data.name,
        asset_type: "empty",
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project Created</ToastTitle>
            </Toast>,
            { intent: "success" }
          );
          handleClose();
        },
        onError: (error: Error) => {
          const creationError = error as ProjectCreationError;
          const specificMessage = getStepSpecificErrorMessage(creationError);
          dispatchToast(
            <Toast>
              <ToastTitle>Project Creation Failed</ToastTitle>
              <ToastBody subtitle={`Error: ${creationError.step || "Unknown"}`}>
                {specificMessage}
              </ToastBody>
            </Toast>,
            { intent: "error" }
          );
          setProgress(null);
        },
      }
    );
  };

  return (
    <ReusableDialog
      open={open}
      onClose={handleClose}
      title={"Create a new survey"}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Create"
      isLoading={isCreateProjectPending}
    >
      <ProjectWorkbookUploadForm
        control={control}
        errors={errors}
        progress={progress}
        isLoading={isCreateProjectPending}
      />
    </ReusableDialog>
  );
};

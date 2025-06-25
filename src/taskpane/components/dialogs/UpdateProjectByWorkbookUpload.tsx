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

interface UpdateXlsFormsProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
  assetUid: string;
  surveyName: string;
  destination: string;
}

export const UpdateXlsFormsByWorkbookUpload = ({
  surveyName,
  assetUid,
  destination,
  open,
  onClose,
  toasterId,
}: UpdateXlsFormsProps) => {
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
  const { mutate: UpdateProjectMutation, isPending: isUpdateProjectPending } =
    useCreateProjectFromFile();

  const handleClose = () => {
    if (isUpdateProjectPending) return;
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
    UpdateProjectMutation(
      {
        assetUid: assetUid,
        destination: destination,
        base64Encoded: data.base64Encoded,
        name: data.name,
        asset_type: "empty",
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project Updated</ToastTitle>
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
              <ToastTitle>Project Update Failed</ToastTitle>
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
      title={`Update ${surveyName}`}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Update"
      isLoading={isUpdateProjectPending}
    >
      <ProjectWorkbookUploadForm
        control={control}
        errors={errors}
        progress={progress}
        isLoading={isUpdateProjectPending}
      />
    </ReusableDialog>
  );
};

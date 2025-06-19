import { useState } from "react";
import { useCreateProjectFromFile } from "../hooks/useAssets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Field,
  Toast,
  ToastTitle,
  ToastBody,
  useId,
  useToastController,
  Toaster,
  ProgressBar,
  Text,
  Card,
  CardHeader,
} from "@fluentui/react-components";
import { ProjectFileUploadFormData, projectFileUploadschema } from "../../validators/schema";
import { ProjectCreationProgress, ProjectCreationError } from "../hooks/useAssets";
import { AttachRegular } from "@fluentui/react-icons";

const CreateProjectFileUpload = () => {
  const [progress, setProgress] = useState<ProjectCreationProgress | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectFileUploadFormData>({
    resolver: zodResolver(projectFileUploadschema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createProjectMutation, isPending: isCreateProjectPending } =
    useCreateProjectFromFile();

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const resetForm = () => {
    reset();
    setProgress(null);
    setIsDialogOpen(false);
  };

  const getStepSpecificErrorMessage = (error: ProjectCreationError) => {
    switch (error.step) {
      case "asset_creation":
        return "Failed to initialize project. Please check your connection and try again.";
      case "file_import":
        return "Failed to upload file. Please check the file format and size.";
      case "status_check":
        return "File uploaded but processing failed. Please try again or contact support.";
      default:
        return "An unexpected error occurred during project creation.";
    }
  };

  const onSubmit = (data: ProjectFileUploadFormData) => {
    const file = data.file;

    createProjectMutation(
      {
        file,
        name: data.name ? data.name : data.file.name,
        asset_type: "empty",
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project created successfully!</ToastTitle>
              <ToastBody subtitle="Success">
                Your project has been created and is ready to use.
              </ToastBody>
            </Toast>,
            { intent: "success" }
          );

          console.log("Project created successfully!");
          resetForm();
        },
        onError: (error: Error) => {
          const creationError = error as ProjectCreationError;
          const specificMessage = creationError.step
            ? getStepSpecificErrorMessage(creationError)
            : "Could not create project. Please try again.";

          dispatchToast(
            <Toast>
              <ToastTitle>Project Creation Failed</ToastTitle>
              <ToastBody
                subtitle={`Error in ${creationError.step?.replace("_", " ") || "unknown step"}`}
              >
                {specificMessage}
              </ToastBody>
            </Toast>,
            { intent: "error" }
          );

          console.error("Project creation failed:", {
            step: creationError.step,
            message: creationError.message,
            details: creationError.details,
            originalError: creationError.originalError,
          });

          setProgress(null);
        },
      }
    );
  };

  return (
    <div>
      <Toaster toasterId={toasterId} />

      <Dialog
        modalType="alert"
        open={isDialogOpen}
        onOpenChange={(_, data) => setIsDialogOpen(data.open)}
      >
        <DialogTrigger disableButtonEnhancement>
          <Button
            appearance="primary"
            className="rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => setIsDialogOpen(true)}
          >
            Create Project XLSX Upload
          </Button>
        </DialogTrigger>
        <DialogSurface className="max-w-xl w-full rounded-lg shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              <DialogTitle className="text-lg font-bold mb-4 border-b pb-2">
                Create New Project
              </DialogTitle>

              <DialogContent className="overflow-y-auto max-h-[70vh] pr-2 space-y-4">
                <Field label="Project Name" validationMessage={errors.name?.message}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter project name"
                        className="w-full rounded-md"
                        disabled={isCreateProjectPending}
                      />
                    )}
                  />
                </Field>

                <Field
                  label="File"
                  validationState={errors.file ? "error" : undefined}
                  validationMessage={errors.file?.message}
                >
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <div style={{ position: "relative" }}>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                          className="w-full rounded-md"
                          style={{
                            position: "absolute",
                            opacity: 0,
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                            zIndex: 1,
                          }}
                          aria-label="File upload"
                          disabled={isCreateProjectPending}
                        />
                        <Input
                          placeholder={field.value?.name || "Choose a file..."}
                          readOnly
                          contentAfter={<AttachRegular />}
                          style={{ cursor: "pointer", width: "100%", height: "100%" }}
                          aria-label="File input display"
                          disabled={isCreateProjectPending}
                        />
                      </div>
                    )}
                  />
                </Field>

                {progress && (
                  <Card className="space-y-3 p-4  rounded-md">
                    <CardHeader
                      header={
                        <div className="flex justify-between items-center">
                          <Text weight="semibold">Creating Project...</Text>
                          <Text size={200}>{progress.progress}%</Text>
                        </div>
                      }
                    />

                    <ProgressBar value={progress.progress / 100} />

                    <div className="space-y-2">
                      {progress.steps.map((step, index) => (
                        <div
                          key={step.step}
                          className={`flex items-center space-x-2 text-sm ${
                            step.completed
                              ? "text-green-600"
                              : progress.currentStep === step.step
                                ? "text-blue-600 font-medium"
                                : "text-gray-500"
                          }`}
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">
                            {step.completed ? "✓" : index + 1}
                          </span>
                          <span>{step.message}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </DialogContent>

              <DialogActions className="pt-4 flex justify-end gap-2">
                <Button
                  type="submit"
                  appearance="primary"
                  className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                  disabled={isCreateProjectPending}
                >
                  {isCreateProjectPending ? "Creating..." : "Create "}
                </Button>
                <Button
                  appearance="secondary"
                  className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                  onClick={resetForm}
                  disabled={isCreateProjectPending}
                >
                  {isCreateProjectPending ? "Cancel" : "Close"}
                </Button>
              </DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default CreateProjectFileUpload;

import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Input,
  Field,
  ProgressBar,
  Text,
  Card,
  CardHeader,
  Button,
} from "@fluentui/react-components";
import { ProjectWorkbookUploadFormData } from "../../../validators/schema";
import { ProjectCreationProgress } from "../../hooks/useAssets";
import { exportOfficeDocumentAsBase64 } from "../../../utils/officeUtils";
import { useState } from "react";

interface ProjectWorkbookUploadFormProps {
  control: Control<ProjectWorkbookUploadFormData>;
  errors: FieldErrors<ProjectWorkbookUploadFormData>;
  progress: ProjectCreationProgress | null;
  isLoading: boolean;
}

export const ProjectWorkbookUploadForm = ({
  control,
  errors,
  progress,
  isLoading,
}: ProjectWorkbookUploadFormProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectWorkbook = async (onChange: (value: string) => void) => {
    setIsExporting(true);
    try {
      const base64Data = await exportOfficeDocumentAsBase64();
      onChange(base64Data);
    } catch (error) {
      console.error("Failed to export workbook:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Project Name (Optional)" validationMessage={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Used only if form title is unspecified"
              disabled={isLoading}
            />
          )}
        />
      </Field>

      <Field
        label="XLSForm File"
        validationState={errors.base64Encoded ? "error" : undefined}
        validationMessage={errors.base64Encoded?.message as string}
      >
        <Controller
          name="base64Encoded"
          control={control}
          render={({ field }) => (
            <div className="space-y-2 w-full">
              <div className="flex flex-col gap-2 w-full">
                <Button
                  appearance="secondary"
                  onClick={() => handleSelectWorkbook(field.onChange)}
                  disabled={isLoading || isExporting}
                >
                  {isExporting ? "Exporting..." : "Select Current Workbook"}
                </Button>

                {field.value && !isExporting && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <Text size={200}>Workbook selected</Text>
                  </div>
                )}
              </div>

              {field.value && (
                <Card
                  {...(field.value && {
                    style: {
                      backgroundColor: "var(--colorNeutralBackground2)",
                    },
                  })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Text size={200} weight="semibold">
                        Current Workbook
                      </Text>
                      <Text size={100}>
                        Base64 data ready ({Math.round(field.value.length / 1024)} KB)
                      </Text>
                    </div>
                    <Button
                      size="small"
                      appearance="outline"
                      onClick={() => field.onChange("")}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        />
      </Field>

      {progress && (
        <Card className="space-y-3 p-4 rounded-md">
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
    </div>
  );
};

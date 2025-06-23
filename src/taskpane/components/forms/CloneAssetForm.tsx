import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, Field } from "@fluentui/react-components";
import { CloneAssetFormData } from "../../../validators/schema";

interface CloneAssetFormProps {
  control: Control<CloneAssetFormData>;
  errors: FieldErrors<CloneAssetFormData>;
  isLoading: boolean;
}
const CloneAssetForm = ({ control, errors }: CloneAssetFormProps) => {
  return (
    <div className="space-y-4">
      <Field label="Asset Name" validationMessage={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter asset name" className="w-full rounded-md" />
          )}
        />
      </Field>
    </div>
  );
};

export default CloneAssetForm;

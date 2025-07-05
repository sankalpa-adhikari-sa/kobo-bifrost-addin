import { zodResolver } from "@hookform/resolvers/zod";
import { useAddAssetGroups } from "../../hooks/useMe";
import { AssetGroupsFormData, assetGroupsFormSchema } from "../../../validators/schema";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Field,
  Input,
  Toast,
  ToastBody,
  Toaster,
  ToastTitle,
  useId,
  useToastController,
} from "@fluentui/react-components";
import { AddIcon, DeleteIcon, EraserIcon } from "../primitives/icons";
import { useDestructiveStyles, useSuccessStyles } from "../primitives/styles";

interface AssetGroupsFormProps {
  data:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
}

export const AssetGroupForm = (props: AssetGroupsFormProps) => {
  const toasterId = useId();
  const { dispatchToast } = useToastController(toasterId);
  const destructiveStyles = useDestructiveStyles();
  const successStyles = useSuccessStyles();
  const data = props?.data;
  const isAddMode = !data;
  const formOptions = {
    resolver: zodResolver(assetGroupsFormSchema),
    defaultValues: {
      asset_groups: [{ label: "", value: "" }],
    },
  };
  const mutateAssetGroup = useAddAssetGroups();
  if (!isAddMode) {
    formOptions.defaultValues = {
      asset_groups: data,
    };
  }
  const {
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<AssetGroupsFormData>(formOptions);
  const { fields, append, remove } = useFieldArray({
    name: "asset_groups",
    control: control,
  });
  const onSubmitForm = (data: AssetGroupsFormData) => {
    reset();

    mutateAssetGroup.mutate(
      { payload: data },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Success</ToastTitle>
              <ToastBody>Successfully updated Groups</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: (err) => {
          dispatchToast(
            <Toast>
              <ToastTitle>Failed to update groups</ToastTitle>
              <ToastBody subtitle="error">{err.message || "An unknown error occurred."}</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
      }
    );
  };
  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    reset();
    clearErrors();
  };
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2">
      <Toaster toasterId={toasterId} />
      {fields.map(({ id }, index) => (
        <div className="flex flex-row gap-3 w-full items-center" key={id}>
          <Field
            label={index === 0 ? "Group Name" : undefined}
            validationMessage={errors.asset_groups?.[index]?.label?.message}
            size="small"
          >
            <Controller
              name={`asset_groups.${index}.label`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Group name" className="w-full rounded-md" />
              )}
            />
          </Field>
          <Field
            label={index === 0 ? "Group Value" : undefined}
            validationMessage={errors.asset_groups?.[index]?.value?.message}
            size="small"
          >
            <Controller
              name={`asset_groups.${index}.value`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Group value" className="w-full rounded-md" />
              )}
            />
          </Field>
          {index > 0 && (
            <div>
              <Button
                className={destructiveStyles.destructive}
                icon={<DeleteIcon className={destructiveStyles.destructiveIcon} />}
                onClick={() => remove(index)}
              />
            </div>
          )}
        </div>
      ))}
      <Button
        icon={<AddIcon className={successStyles.successIcon} />}
        className={successStyles.success}
        type="button"
        appearance="secondary"
        onClick={() => append({ label: "", value: "" })}
      >
        Add
      </Button>
      <div className="flex flex-row  gap-2">
        <Button appearance="primary" type="submit">
          {isAddMode ? "Submit" : "Edit"}
        </Button>
        <Button
          className={destructiveStyles.destructive}
          onClick={handleReset}
          icon={<EraserIcon className={destructiveStyles.destructiveIcon} />}
        />
      </div>
    </form>
  );
};

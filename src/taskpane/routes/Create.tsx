import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Textarea,
  Dropdown,
  Option,
  Field,
  Toast,
  ToastTitle,
  ToastBody,
  useId,
  useToastController,
  Toaster,
} from "@fluentui/react-components";
import { countriesOptions, sectorOptions } from "../../utils/constants";
import { AssetFormData, assetFormSchema } from "../../validators/schema";

const Create = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: "",
      settings: {
        description: "",
        operational_purpose: null,
        collects_pii: null,
      },
      asset_type: "survey",
    },
  });
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle>Email sent</ToastTitle>
        <ToastBody subtitle="Subtitle">This is a toast body</ToastBody>
      </Toast>,
      { intent: "success" }
    );
  const onSubmit = (data: AssetFormData) => {
    reset();
    notify();
    console.log("Form Data:", JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster toasterId={toasterId} />
      <Dialog modalType="alert">
        <DialogTrigger disableButtonEnhancement>
          <Button
            appearance="primary"
            className="rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Create Empty Asset
          </Button>
        </DialogTrigger>
        <DialogSurface className="max-w-xl w-full  rounded-lg shadow-2xl ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              <DialogTitle className="text-lg font-bold  mb-4 border-b pb-2">
                Create New Asset
              </DialogTitle>
              <DialogContent className="overflow-y-auto max-h-[70vh] pr-2 space-y-2">
                <Field label="Asset Name" validationMessage={errors.name?.message}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter asset name"
                        className="w-full rounded-md"
                      />
                    )}
                  />
                </Field>

                <Field
                  label="Description"
                  validationMessage={errors.settings?.description?.message}
                >
                  <Controller
                    name="settings.description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Provide a description for the asset"
                        className="w-full rounded-md"
                        rows={3}
                      />
                    )}
                  />
                </Field>

                <Field label="Sector" validationMessage={errors.settings?.sector?.message}>
                  <Controller
                    name="settings.sector"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        placeholder="Select Sector"
                        value={value?.label || ""}
                        onOptionSelect={(_, data) => {
                          const selectedValue = data.optionValue;
                          if (selectedValue) {
                            const selectedOption = sectorOptions.find(
                              (s) => s.value === selectedValue
                            );
                            onChange(selectedOption);
                          }
                        }}
                        className="w-full rounded-md"
                      >
                        {sectorOptions.map((s) => (
                          <Option key={s.value} value={s.value}>
                            {s.label}
                          </Option>
                        ))}
                      </Dropdown>
                    )}
                  />
                </Field>

                <Field
                  label="Country/Countries of Operation"
                  validationMessage={errors.settings?.country?.message}
                >
                  <Controller
                    name="settings.country"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        multiselect
                        placeholder="Select Countries"
                        selectedOptions={value?.map((c: any) => c.value) || []}
                        onOptionSelect={(_, data) => {
                          const selectedCountries = countriesOptions.filter((country) =>
                            data.selectedOptions.includes(country.value)
                          );
                          onChange(selectedCountries);
                        }}
                        className="w-full rounded-md"
                      >
                        {countriesOptions.map((country) => (
                          <Option key={country.value} value={country.value}>
                            {country.label}
                          </Option>
                        ))}
                      </Dropdown>
                    )}
                  />
                </Field>
              </DialogContent>
              <DialogActions className="pt-4 flex justify-end gap-2">
                <Button
                  type="submit"
                  appearance="primary"
                  className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  Submit
                </Button>
                <DialogTrigger disableButtonEnhancement>
                  <Button
                    appearance="secondary"
                    className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    Close
                  </Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default Create;

import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, Textarea, Dropdown, Option, Field } from "@fluentui/react-components";
import { countriesOptions, sectorOptions } from "../../../utils/constants";
import { ProjectMetadataFormData } from "../../../validators/schema";

interface AssetMetadataFormProps {
  control: Control<ProjectMetadataFormData>;
  errors: FieldErrors<ProjectMetadataFormData>;
  isLoading: boolean;
}
const AssetMetadataForm = ({ control, errors }: AssetMetadataFormProps) => {
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

      <Field label="Description" validationMessage={errors.settings?.description?.message}>
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
                  const selectedOption = sectorOptions.find((s) => s.value === selectedValue);
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
    </div>
  );
};

export default AssetMetadataForm;

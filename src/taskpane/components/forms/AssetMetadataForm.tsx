import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, Textarea, Dropdown, Option, Field } from "@fluentui/react-components";
import { countriesOptions, sectorOptions } from "../../../utils/constants";
import { ProjectMetadataFormData } from "../../../validators/schema";
import { EraserIcon } from "../primitives/icons";
import { useDestructiveStyles } from "../primitives/styles";

interface AssetMetadataFormProps {
  control: Control<ProjectMetadataFormData>;
  errors: FieldErrors<ProjectMetadataFormData>;
  isLoading: boolean;
  asset_groups:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
}
const AssetMetadataForm = ({ control, errors, asset_groups }: AssetMetadataFormProps) => {
  const destructiveStyles = useDestructiveStyles();
  return (
    <div className="space-y-2">
      <Field label="Asset Name" validationMessage={errors.name?.message} size="small">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter asset name" className="w-full rounded-md" />
          )}
        />
      </Field>

      <Field
        label="Description"
        validationMessage={errors.settings?.description?.message}
        size="small"
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

      <Field label="Sector" validationMessage={errors.settings?.sector?.message} size="small">
        <Controller
          name="settings.sector"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              placeholder="Select Sector"
              value={value?.label || ""}
              selectedOptions={value ? [value.value] : []}
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
        size="small"
      >
        <Controller
          name="settings.country"
          control={control}
          render={({ field: { onChange, value } }) => {
            const displayValue =
              value && value.length > 0 ? value.map((c) => c.label).join(", ") : "";

            return (
              <Dropdown
                multiselect
                placeholder="Select Countries"
                value={displayValue}
                selectedOptions={value?.map((c) => c.value) || []}
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
            );
          }}
        />
      </Field>
      {asset_groups && (
        <Field label="Group" validationMessage={errors.settings?.group?.message} size="small">
          <Controller
            name="settings.group"
            control={control}
            render={({ field: { onChange, value } }) => {
              const selectedOption = asset_groups.find((opt) => opt.value === value);
              console.log(selectedOption);
              return (
                <Dropdown
                  placeholder="Select Group"
                  value={selectedOption?.label || ""}
                  selectedOptions={value ? [value] : []}
                  onOptionSelect={(_, data) => {
                    if (data.optionValue === "__reset") {
                      onChange(null);
                    } else {
                      onChange(data.optionValue);
                    }
                  }}
                  className="w-full rounded-md"
                >
                  {asset_groups.map((s) => (
                    <Option key={s.value} value={s.value}>
                      {s.label}
                    </Option>
                  ))}
                  <Option className={destructiveStyles.destructive} key={"__reset"} text="">
                    <span className="flex flex-row gap-2 items-center">
                      <EraserIcon className={destructiveStyles.destructiveIcon} />
                      Reset
                    </span>
                  </Option>
                </Dropdown>
              );
            }}
          />
        </Field>
      )}
    </div>
  );
};

export default AssetMetadataForm;

import { Controller, Control, FieldErrors, useWatch } from "react-hook-form";
import { Input, Textarea, Dropdown, Option, Field } from "@fluentui/react-components";
import { countriesOptions, organizationTypeOptions, sectorOptions } from "../../../utils/constants";
import { ProfileFormData } from "../../../validators/schema";

interface ProfileFormsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isLoading: boolean;
}

const ProfileForms = ({ control, errors }: ProfileFormsProps) => {
  const organizationType = useWatch({
    control,
    name: "organization_type",
  });
  return (
    <div className="space-y-2">
      <Field required label="Full Name" validationMessage={errors.name?.message} size="small">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              placeholder="Enter your name"
              className="w-full rounded-md"
              required
            />
          )}
        />
      </Field>
      <Field
        required
        label="Country/Countries of Operation"
        validationMessage={errors.country?.message}
        size="small"
      >
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedOption = countriesOptions.find((opt) => opt.value === value);
            return (
              <Dropdown
                placeholder="Select country"
                value={selectedOption?.label || ""}
                selectedOptions={value ? [value] : []}
                onOptionSelect={(_, data) => {
                  onChange(data.optionValue);
                }}
                className="w-full rounded-md"
              >
                {countriesOptions.map((s) => (
                  <Option key={s.value} value={s.value}>
                    {s.label}
                  </Option>
                ))}
              </Dropdown>
            );
          }}
        />
      </Field>

      <Field label="City" validationMessage={errors.city?.message} size="small">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              placeholder="City"
              className="w-full rounded-md"
            />
          )}
        />
      </Field>

      <Field required label="Sector" validationMessage={errors.sector?.message} size="small">
        <Controller
          name="sector"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedOption = sectorOptions.find((opt) => opt.value === value);
            return (
              <Dropdown
                placeholder="Select Sector"
                value={selectedOption?.label || ""}
                selectedOptions={value ? [value] : []}
                onOptionSelect={(_, data) => {
                  onChange(data.optionValue);
                }}
                className="w-full rounded-md"
              >
                {sectorOptions.map((s) => (
                  <Option key={s.value} value={s.value}>
                    {s.label}
                  </Option>
                ))}
              </Dropdown>
            );
          }}
        />
      </Field>

      <Field
        required
        label="Organization type"
        validationMessage={errors.organization_type?.message}
        size="small"
      >
        <Controller
          name="organization_type"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedOption = organizationTypeOptions.find((opt) => opt.value === value);
            return (
              <Dropdown
                placeholder="Select Organization type"
                value={selectedOption?.label || ""}
                selectedOptions={value ? [value] : []}
                onOptionSelect={(_, data) => {
                  onChange(data.optionValue);
                }}
                className="w-full rounded-md"
              >
                {organizationTypeOptions.map((s) => (
                  <Option key={s.value} value={s.value}>
                    {s.label}
                  </Option>
                ))}
              </Dropdown>
            );
          }}
        />
      </Field>
      {organizationType !== "none" && (
        <Field
          required
          label="Organization Name"
          validationMessage={errors.organization?.message}
          size="small"
        >
          <Controller
            name="organization"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="Name of your Organization"
                className="w-full rounded-md"
                rows={3}
              />
            )}
          />
        </Field>
      )}
      <Field
        label="Organization Website"
        validationMessage={errors.organization_website?.message}
        size="small"
      >
        <Controller
          name="organization_website"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value || ""}
              placeholder="Website Url"
              className="w-full rounded-md"
              rows={3}
            />
          )}
        />
      </Field>

      <Field label="Bio" validationMessage={errors.bio?.message} size="small">
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value || ""}
              placeholder="Provide a bio"
              className="w-full rounded-md"
              rows={3}
            />
          )}
        />
      </Field>

      <Field label="Linkedin" validationMessage={errors.linkedin?.message} size="small">
        <Controller
          name="linkedin"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value || ""}
              placeholder="LinkedIn URL"
              className="w-full rounded-md"
              rows={3}
            />
          )}
        />
      </Field>
    </div>
  );
};

export default ProfileForms;

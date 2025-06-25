import { z } from "zod";
import { countriesOptions, organizationTypeOptions, sectorOptions } from "../utils/constants";
export const assetImportschema = z.object({
  file: z.any().refine((val) => val instanceof File, {
    message: "A valid file is required",
  }),
  destination: z.string().url(),
  assetUid: z.string().uuid().min(1, "AssetUid is required"),
  name: z.string().optional(),
});
export const projectFileUploadschema = z.object({
  file: z.instanceof(File, { message: "A valid file is required" }),
  name: z.string().optional(),
});
export const mediaUploadschema = z.object({
  file: z.instanceof(File, { message: "A valid file is required" }),
  fileName: z.string(),
  description: z.string(),
  fileType: z.string(),
});
export const projectUrlUploadschema = z.object({
  url: z.string().url().min(1, "XLSX form url is required"),
  name: z.string().optional(),
});

export const emptySurveyAssetFormSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  settings: z.object({
    description: z.string().min(1, "Description is required"),
    sector: z.object(
      {
        value: z.string(),
        label: z.string(),
      },
      { required_error: "Sector is required" }
    ),
    country: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .min(1, "At least one country is required"),
    operational_purpose: z.null(),
    collects_pii: z.null(),
  }),
  asset_type: z.string(),
});

export const projectMetadataFormSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  settings: z.object({
    description: z.string().min(1, "Description is required"),
    sector: z.object(
      {
        value: z.string(),
        label: z.string(),
      },
      { required_error: "Sector is required" }
    ),
    country: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .min(1, "At least one country is required"),
  }),
});

const countryValues = countriesOptions.map((opt) => opt.value);
const sectorValues = sectorOptions.map((opt) => opt.value);
const organizationTypeValues = organizationTypeOptions.map((opt) => opt.value);

export const profileSchema = z.object({
  country: z.enum(countryValues as [string, ...string[]]),
  city: z.string().optional(),
  sector: z.enum(sectorValues as [string, ...string[]]),
  organization_type: z.enum(organizationTypeValues as [string, ...string[]]),
  organization: z.string().min(1, "Organization name is required"),
  organization_website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  name: z.string().min(1, "Fullname is required"),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const emptyAssetFormSchema = z.object({
  asset_type: z.string(),
});

export const cloneAssetFormSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
});

export type AssetImportFormData = z.infer<typeof assetImportschema>;
export type ProjectMetadataFormData = z.infer<typeof projectMetadataFormSchema>;
export type ProjectFileUploadFormData = z.infer<typeof projectFileUploadschema>;
export type MediaUploadFormData = z.infer<typeof mediaUploadschema>;
export type ProjectUrlUploadFormData = z.infer<typeof projectUrlUploadschema>;
export type EmptySurveyAssetFormData = z.infer<typeof emptySurveyAssetFormSchema>;
export type EmptyAssetFormData = z.infer<typeof emptyAssetFormSchema>;
export type CloneAssetFormData = z.infer<typeof cloneAssetFormSchema>;

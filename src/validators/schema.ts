import { z } from "zod";

export const assetFormSchema = z.object({
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

export type AssetFormData = z.infer<typeof assetFormSchema>;

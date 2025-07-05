import { ValidationStatusName } from "../utils/constants";

export interface LabelValuePair {
  label: string;
  value: string;
}

export interface AssetsRequestData {
  q?: string;
  limit?: number;
  offset?: number;
  parent?: string;
  all_public?: boolean;
  ordering?: string;
  metadata?: string;
  collections_first?: string;
  status?: string;
}

export interface AssetsMetadataRequestData {
  q?: string;
  limit?: number;
  offset?: number;
  parent?: string;
  all_public?: boolean;
  ordering?: string;
  status?: string;
}

export interface BulkSubmissionsRequest {
  query?: {
    [id: string]: any;
  };
  confirm?: boolean;
  submission_ids?: string[];
  "validation_status.uid"?: ValidationStatusName;
}

export type ProjectFieldName =
  | "countries"
  | "dateDeployed"
  | "dateModified"
  | "description"
  | "languages"
  | "name"
  | "ownerEmail"
  | "ownerFullName"
  | "ownerOrganization"
  | "ownerUsername"
  | "sector"
  | "status"
  | "submissions";

export type FilterConditionName =
  | "contains"
  | "doesNotContain"
  | "endsWith"
  | "is"
  | "isEmpty"
  | "isEmptyObject"
  | "isNot"
  | "isNotEmpty"
  | "isNotEmptyObject"
  | "startsWith";
export interface ProjectsFilterDefinition {
  fieldName?: ProjectFieldName;
  condition?: FilterConditionName;
  value?: string;
}
export type OrderDirection = "ascending" | "descending";
export interface ProjectsTableOrder {
  fieldName?: ProjectFieldName;
  direction?: OrderDirection;
}
export interface ViewSettings {
  filters: ProjectsFilterDefinition[];
  order: ProjectsTableOrder;
  fields?: ProjectFieldName[];
}
export interface ProjectViewsSettings {
  [viewUid: string]: ViewSettings;
}
export interface AccountRequest {
  email?: string;
  extra_details?: {
    name?: string;
    organization?: string;
    organization_website?: string;
    sector?: string;
    gender?: string;
    bio?: string;
    city?: string;
    country?: string;
    require_auth?: boolean;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    project_views_settings?: ProjectViewsSettings;
    last_ui_language?: string;
  };
  current_password?: string;
  new_password?: string;
}

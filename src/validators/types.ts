export interface ExtraDetails {
  bio: string;
  city: string;
  name: string;
  sector: string;
  country: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  organization: string;
  last_ui_language: string;
  organization_type: string;
  organization_website: string;
  project_views_settings: Record<string, any>;
  require_auth: boolean;
  newsletter_subscription: string;
  asset_groups?: { label: string; value: string }[];
}

export interface GitRevision {
  short: string;
  long: string;
  branch: string;
  tag: string;
}

export interface SocialAccount {
  provider: string;
  uid: string;
  last_joined: string;
  date_joined: string;
  email: string;
  username: string;
}

export interface Organization {
  url: string;
  name: string;
  uid: string;
}

export interface UserProfileResponse {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  server_time: string;
  date_joined: string;
  projects_url: string;
  gravatar: string;
  last_login: string;
  extra_details: ExtraDetails;
  git_rev: boolean | GitRevision;
  social_accounts: SocialAccount[];
  validated_password: boolean;
  accepted_tos: boolean;
  organization: Organization;
  extra_details__uid: string;
}

export const actionOptions = [
  {
    name: "update-name",
    label: "change name",
    getMessage: (username: string) => `${username} changed project name`,
  },
  {
    name: "update-settings",
    label: "update settings",
    getMessage: (username: string) => `${username} updated project settings`,
  },
  {
    name: "deploy",
    label: "deploy project",
    getMessage: (username: string) => `${username} deployed project`,
  },
  {
    name: "redeploy",
    label: "redeploy project",
    getMessage: (username: string) => `${username} redeployed project`,
  },
  {
    name: "archive",
    label: "archive project",
    getMessage: (username: string) => `${username} archived project`,
  },
  {
    name: "unarchive",
    label: "unarchive project",
    getMessage: (username: string) => `${username} unarchived project`,
  },
  {
    name: "replace-form",
    label: "upload new form",
    getMessage: (username: string) => `${username} uploaded a new form`,
  },
  {
    name: "update-content",
    label: "edit form",
    getMessage: (username: string) => `${username} edited the form in the form builder`,
  },
  {
    name: "update-qa",
    label: "modify qualitative analysis questions",
    getMessage: (username: string) => `${username} modified qualitative analysis questions`,
  },
  {
    name: "modify-qa-data",
    label: "edit qualitative analysis data",
    getMessage: (username: string) => `${username} edited qualitative analysis data`,
  },
  {
    name: "export",
    label: "export data",
    getMessage: (username: string) => `${username} exported data`,
  },
  {
    name: "add-media",
    label: "add media attachment",
    getMessage: (username: string) => `${username} added a media attachment`,
  },
  {
    name: "delete-media",
    label: "remove media attachment",
    getMessage: (username: string) => `${username} removed a media attachment`,
  },
  {
    name: "modify-user-permissions",
    label: "update permissions",
    getMessage: (username: string, targetUser?: string) =>
      `${username} updated permissions of ${targetUser || "another user"}`,
  },
  {
    name: "clone-permissions",
    label: "clone permissions",
    getMessage: (username: string) => `${username} cloned permissions from another project`,
  },
  {
    name: "share-form-publicly",
    label: "make project public",
    getMessage: (username: string) => `${username} made the project publicly accessible`,
  },
  {
    name: "share-data-publicly",
    label: "share data publicly",
    getMessage: (username: string) => `${username} shared data publicly`,
  },
  {
    name: "allow-anonymous-submissions",
    label: "enable anonymous submissions",
    getMessage: (username: string) => `${username} enabled anonymous submissions`,
  },
  {
    name: "unshare-form-publicly",
    label: "disable making project public",
    getMessage: (username: string) => `${username} disabled making project publicly accessible`,
  },
  {
    name: "unshare-data-publicly",
    label: "disable sharing data publicly",
    getMessage: (username: string) => `${username} disabled sharing data publicly`,
  },
  {
    name: "disallow-anonymous-submissions",
    label: "disable anonymous submissions",
    getMessage: (username: string) => `${username} disallowed anonymous submissions`,
  },
  {
    name: "transfer",
    label: "transfer project ownership",
    getMessage: (username: string, targetUser?: string) =>
      `${username} transferred project ownership to ${targetUser || "another user"}`,
  },
  {
    name: "enable-sharing",
    label: "enable data sharing",
    getMessage: (username: string) => `${username} enabled data sharing`,
  },
  {
    name: "modify-sharing",
    label: "modify data sharing",
    getMessage: (username: string) => `${username} modified data sharing`,
  },
  {
    name: "disable-sharing",
    label: "disable data sharing",
    getMessage: (username: string) => `${username} disabled data sharing`,
  },
  {
    name: "connect-project",
    label: "connect project data",
    getMessage: (username: string) => `${username} connected project data with another project`,
  },
  {
    name: "modify-imported-fields",
    label: "change imported fields",
    getMessage: (username: string) => `${username} changed imported fields from another project`,
  },
  {
    name: "disconnect-project",
    label: "disconnect project",
    getMessage: (username: string) => `${username} disconnected project from another project`,
  },
  {
    name: "register-service",
    label: "register a new REST service",
    getMessage: (username: string) => `${username} registered a new REST service`,
  },
  {
    name: "modify-service",
    label: "modify a REST service",
    getMessage: (username: string) => `${username} modified a REST service`,
  },
  {
    name: "delete-service",
    label: "delete a REST service",
    getMessage: (username: string) => `${username} deleted a REST service`,
  },
  {
    name: "add-submission",
    label: "add submission",
    getMessage: (username: string) => `${username} added a submission`,
  },
  {
    name: "modify-submission",
    label: "edit submission",
    getMessage: (username: string) => `${username} edited a submission`,
  },
  {
    name: "delete-submission",
    label: "delete a submission",
    getMessage: (username: string) => `${username} deleted a submission`,
  },
];
export const organizationTypeOptions = [
  { value: "non-profit", label: "Non-profit organization" },
  { value: "government", label: "Government institution" },
  { value: "educational", label: "Educational organization" },
  { value: "commercial", label: "A commercial/for-profit company" },
  { value: "none", label: "I am not associated with any organization" },
] as const;

export const sectorOptions = [
  { value: "Public Administration", label: "Public Administration" },
  { value: "Arts, Entertainment, and Recreation", label: "Arts, Entertainment, and Recreation" },
  {
    value: "Educational Services / Higher Education",
    label: "Educational Services / Higher Education",
  },
  { value: "Health Services / Public Health", label: "Health Services / Public Health" },
  { value: "Finance and Insurance", label: "Finance and Insurance" },
  { value: "Information / Media", label: "Information / Media" },
  { value: "Economic/Social Development", label: "Economic/Social Development" },
  { value: "Security / Police / Peacekeeping", label: "Security / Police / Peacekeeping" },
  { value: "Disarmament & Demobilization", label: "Disarmament & Demobilization" },
  { value: "Environment", label: "Environment" },
  { value: "Private sector", label: "Private sector" },
  {
    value: "Humanitarian - Coordination / Information Management",
    label: "Humanitarian - Coordination / Information Management",
  },
  { value: "Humanitarian - Multiple Clusters", label: "Humanitarian - Multiple Clusters" },
  {
    value: "Humanitarian - Camp Management & Coordination",
    label: "Humanitarian - Camp Management & Coordination",
  },
  { value: "Humanitarian - Early Recovery", label: "Humanitarian - Early Recovery" },
  { value: "Humanitarian - Education", label: "Humanitarian - Education" },
  { value: "Humanitarian - Emergency Shelter", label: "Humanitarian - Emergency Shelter" },
  { value: "Humanitarian - Emergency Telecoms", label: "Humanitarian - Emergency Telecoms" },
  { value: "Humanitarian - Food Security", label: "Humanitarian - Food Security" },
  { value: "Humanitarian - Health", label: "Humanitarian - Health" },
  { value: "Humanitarian - Logistics", label: "Humanitarian - Logistics" },
  { value: "Humanitarian - Nutrition", label: "Humanitarian - Nutrition" },
  { value: "Humanitarian - Protection", label: "Humanitarian - Protection" },
  {
    value: "Humanitarian - Sanitation, Water & Hygiene",
    label: "Humanitarian - Sanitation, Water & Hygiene",
  },
  { value: "Other", label: "Other" },
] as const;

export const countriesOptions = [
  { value: "AFG", label: "Afghanistan" },
  { value: "ALA", label: "Åland Islands" },
  { value: "ALB", label: "Albania" },
  { value: "DZA", label: "Algeria" },
  { value: "ASM", label: "American Samoa" },
  { value: "AND", label: "Andorra" },
  { value: "AGO", label: "Angola" },
  { value: "AIA", label: "Anguilla" },
  { value: "ATA", label: "Antarctica" },
  { value: "ATG", label: "Antigua and Barbuda" },
  { value: "ARG", label: "Argentina" },
  { value: "ARM", label: "Armenia" },
  { value: "ABW", label: "Aruba" },
  { value: "AUS", label: "Australia" },
  { value: "AUT", label: "Austria" },
  { value: "AZE", label: "Azerbaijan" },
  { value: "BHS", label: "Bahamas" },
  { value: "BHR", label: "Bahrain" },
  { value: "BGD", label: "Bangladesh" },
  { value: "BRB", label: "Barbados" },
  { value: "BLR", label: "Belarus" },
  { value: "BEL", label: "Belgium" },
  { value: "BLZ", label: "Belize" },
  { value: "BEN", label: "Benin" },
  { value: "BMU", label: "Bermuda" },
  { value: "BTN", label: "Bhutan" },
  { value: "BOL", label: "Bolivia, Plurinational State of" },
  { value: "BIH", label: "Bosnia and Herzegovina" },
  { value: "BES", label: "Bonaire, Sint Eustatius and Saba" },
  { value: "BWA", label: "Botswana" },
  { value: "BVT", label: "Bouvet Island" },
  { value: "BRA", label: "Brazil" },
  { value: "IOT", label: "British Indian Ocean Territory" },
  { value: "BRN", label: "Brunei Darussalam" },
  { value: "BGR", label: "Bulgaria" },
  { value: "BFA", label: "Burkina Faso" },
  { value: "BDI", label: "Burundi" },
  { value: "KHM", label: "Cambodia" },
  { value: "CMR", label: "Cameroon" },
  { value: "CAN", label: "Canada" },
  { value: "CPV", label: "Cape Verde" },
  { value: "CYM", label: "Cayman Islands" },
  { value: "CAF", label: "Central African Republic" },
  { value: "TCD", label: "Chad" },
  { value: "CHL", label: "Chile" },
  { value: "CHN", label: "China" },
  { value: "CXR", label: "Christmas Island" },
  { value: "CCK", label: "Cocos (Keeling) Islands" },
  { value: "COL", label: "Colombia" },
  { value: "COM", label: "Comoros" },
  { value: "COG", label: "Congo" },
  { value: "COD", label: "Congo, The Democratic Republic of the" },
  { value: "COK", label: "Cook Islands" },
  { value: "CRI", label: "Costa Rica" },
  { value: "CIV", label: "Côte d'Ivoire" },
  { value: "HRV", label: "Croatia" },
  { value: "CUB", label: "Cuba" },
  { value: "CUW", label: "Curaçao" },
  { value: "CYP", label: "Cyprus" },
  { value: "CZE", label: "Czech Republic" },
  { value: "DNK", label: "Denmark" },
  { value: "DJI", label: "Djibouti" },
  { value: "DMA", label: "Dominica" },
  { value: "DOM", label: "Dominican Republic" },
  { value: "ECU", label: "Ecuador" },
  { value: "EGY", label: "Egypt" },
  { value: "SLV", label: "El Salvador" },
  { value: "GNQ", label: "Equatorial Guinea" },
  { value: "ERI", label: "Eritrea" },
  { value: "EST", label: "Estonia" },
  { value: "ETH", label: "Ethiopia" },
  { value: "FLK", label: "Falkland Islands (Malvinas)" },
  { value: "FRO", label: "Faroe Islands" },
  { value: "FJI", label: "Fiji" },
  { value: "FIN", label: "Finland" },
  { value: "FRA", label: "France" },
  { value: "GUF", label: "French Guiana" },
  { value: "PYF", label: "French Polynesia" },
  { value: "ATF", label: "French Southern Territories" },
  { value: "GAB", label: "Gabon" },
  { value: "GMB", label: "Gambia" },
  { value: "GEO", label: "Georgia" },
  { value: "DEU", label: "Germany" },
  { value: "GHA", label: "Ghana" },
  { value: "GIB", label: "Gibraltar" },
  { value: "GRC", label: "Greece" },
  { value: "GRL", label: "Greenland" },
  { value: "GRD", label: "Grenada" },
  { value: "GLP", label: "Guadeloupe" },
  { value: "GUM", label: "Guam" },
  { value: "GTM", label: "Guatemala" },
  { value: "GGY", label: "Guernsey" },
  { value: "GIN", label: "Guinea" },
  { value: "GNB", label: "Guinea-Bissau" },
  { value: "GUY", label: "Guyana" },
  { value: "HTI", label: "Haiti" },
  { value: "HMD", label: "Heard Island and McDonald Islands" },
  { value: "VAT", label: "Holy See (Vatican City State)" },
  { value: "HND", label: "Honduras" },
  { value: "HKG", label: "Hong Kong" },
  { value: "HUN", label: "Hungary" },
  { value: "ISL", label: "Iceland" },
  { value: "IND", label: "India" },
  { value: "IDN", label: "Indonesia" },
  { value: "IRN", label: "Iran, Islamic Republic of" },
  { value: "IRQ", label: "Iraq" },
  { value: "IRL", label: "Ireland" },
  { value: "IMN", label: "Isle of Man" },
  { value: "ISR", label: "Israel" },
  { value: "ITA", label: "Italy" },
  { value: "JAM", label: "Jamaica" },
  { value: "JPN", label: "Japan" },
  { value: "JEY", label: "Jersey" },
  { value: "JOR", label: "Jordan" },
  { value: "KAZ", label: "Kazakhstan" },
  { value: "KEN", label: "Kenya" },
  { value: "KIR", label: "Kiribati" },
  { value: "PRK", label: "Korea, Democratic People's Republic of" },
  { value: "KOR", label: "Korea, Republic of" },
  { value: "XKX", label: "Kosovo" },
  { value: "KWT", label: "Kuwait" },
  { value: "KGZ", label: "Kyrgyzstan" },
  { value: "LAO", label: "Lao People's Democratic Republic" },
  { value: "LVA", label: "Latvia" },
  { value: "LBN", label: "Lebanon" },
  { value: "LSO", label: "Lesotho" },
  { value: "LBR", label: "Liberia" },
  { value: "LBY", label: "Libya" },
  { value: "LIE", label: "Liechtenstein" },
  { value: "LTU", label: "Lithuania" },
  { value: "LUX", label: "Luxembourg" },
  { value: "MAC", label: "Macao" },
  { value: "MKD", label: "Macedonia, The Former Yugoslav Republic of" },
  { value: "MDG", label: "Madagascar" },
  { value: "MWI", label: "Malawi" },
  { value: "MYS", label: "Malaysia" },
  { value: "MDV", label: "Maldives" },
  { value: "MLI", label: "Mali" },
  { value: "MLT", label: "Malta" },
  { value: "MHL", label: "Marshall Islands" },
  { value: "MTQ", label: "Martinique" },
  { value: "MRT", label: "Mauritania" },
  { value: "MUS", label: "Mauritius" },
  { value: "MYT", label: "Mayotte" },
  { value: "MEX", label: "Mexico" },
  { value: "FSM", label: "Micronesia, Federated States of" },
  { value: "MDA", label: "Moldova, Republic of" },
  { value: "MCO", label: "Monaco" },
  { value: "MNG", label: "Mongolia" },
  { value: "MNE", label: "Montenegro" },
  { value: "MSR", label: "Montserrat" },
  { value: "MAR", label: "Morocco" },
  { value: "MOZ", label: "Mozambique" },
  { value: "MMR", label: "Myanmar" },
  { value: "NAM", label: "Namibia" },
  { value: "NRU", label: "Nauru" },
  { value: "NPL", label: "Nepal" },
  { value: "NLD", label: "Netherlands" },
  { value: "ANT", label: "Netherlands Antilles" },
  { value: "NCL", label: "New Caledonia" },
  { value: "NZL", label: "New Zealand" },
  { value: "NIC", label: "Nicaragua" },
  { value: "NER", label: "Niger" },
  { value: "NGA", label: "Nigeria" },
  { value: "NIU", label: "Niue" },
  { value: "NFK", label: "Norfolk Island" },
  { value: "MNP", label: "Northern Mariana Islands" },
  { value: "NOR", label: "Norway" },
  { value: "OMN", label: "Oman" },
  { value: "PAK", label: "Pakistan" },
  { value: "PLW", label: "Palau" },
  { value: "PSE", label: "occupied Palestinian territory" },
  { value: "PAN", label: "Panama" },
  { value: "PNG", label: "Papua New Guinea" },
  { value: "PRY", label: "Paraguay" },
  { value: "PER", label: "Peru" },
  { value: "PHL", label: "Philippines" },
  { value: "PCN", label: "Pitcairn" },
  { value: "POL", label: "Poland" },
  { value: "PRT", label: "Portugal" },
  { value: "PRI", label: "Puerto Rico" },
  { value: "QAT", label: "Qatar" },
  { value: "REU", label: "Réunion" },
  { value: "ROU", label: "Romania" },
  { value: "RUS", label: "Russian Federation" },
  { value: "RWA", label: "Rwanda" },
  { value: "BLM", label: "Saint Barthélemy" },
  { value: "SHN", label: "Saint Helena, Ascension and Tristan da Cunha" },
  { value: "KNA", label: "Saint Kitts and Nevis" },
  { value: "LCA", label: "Saint Lucia" },
  { value: "MAF", label: "Saint Martin (French part)" },
  { value: "SPM", label: "Saint Pierre and Miquelon" },
  { value: "VCT", label: "Saint Vincent and the Grenadines" },
  { value: "WSM", label: "Samoa" },
  { value: "SMR", label: "San Marino" },
  { value: "STP", label: "São Tomé and Príncipe" },
  { value: "SAU", label: "Saudi Arabia" },
  { value: "SEN", label: "Senegal" },
  { value: "SRB", label: "Serbia" },
  { value: "SYC", label: "Seychelles" },
  { value: "SLE", label: "Sierra Leone" },
  { value: "SGP", label: "Singapore" },
  { value: "SXM", label: "Sint Maarten (Dutch part)" },
  { value: "SVK", label: "Slovakia" },
  { value: "SVN", label: "Slovenia" },
  { value: "SLB", label: "Solomon Islands" },
  { value: "SOM", label: "Somalia" },
  { value: "ZAF", label: "South Africa" },
  { value: "SGS", label: "South Georgia and the South Sandwich Islands" },
  { value: "ESP", label: "Spain" },
  { value: "LKA", label: "Sri Lanka" },
  { value: "SSD", label: "South Sudan" },
  { value: "SDN", label: "Sudan" },
  { value: "SUR", label: "Suriname" },
  { value: "SJM", label: "Svalbard and Jan Mayen" },
  { value: "SWZ", label: "Swaziland" },
  { value: "SWE", label: "Sweden" },
  { value: "CHE", label: "Switzerland" },
  { value: "SYR", label: "Syrian Arab Republic" },
  { value: "TWN", label: "Taiwan, Province of China" },
  { value: "TJK", label: "Tajikistan" },
  { value: "TZA", label: "Tanzania, United Republic of" },
  { value: "THA", label: "Thailand" },
  { value: "TLS", label: "Timor-Leste" },
  { value: "TGO", label: "Togo" },
  { value: "TKL", label: "Tokelau" },
  { value: "TON", label: "Tonga" },
  { value: "TTO", label: "Trinidad and Tobago" },
  { value: "TUN", label: "Tunisia" },
  { value: "TUR", label: "Turkey" },
  { value: "TKM", label: "Turkmenistan" },
  { value: "TCA", label: "Turks and Caicos Islands" },
  { value: "TUV", label: "Tuvalu" },
  { value: "UGA", label: "Uganda" },
  { value: "UKR", label: "Ukraine" },
  { value: "ARE", label: "United Arab Emirates" },
  { value: "GBR", label: "United Kingdom" },
  { value: "USA", label: "United States" },
  { value: "UMI", label: "United States Minor Outlying Islands" },
  { value: "URY", label: "Uruguay" },
  { value: "UZB", label: "Uzbekistan" },
  { value: "VUT", label: "Vanuatu" },
  { value: "VEN", label: "Venezuela, Bolivarian Republic of" },
  { value: "VNM", label: "Viet Nam" },
  { value: "VGB", label: "Virgin Islands, British" },
  { value: "VIR", label: "Virgin Islands, U.S." },
  { value: "WLF", label: "Wallis and Futuna" },
  { value: "ESH", label: "Western Sahara" },
  { value: "YEM", label: "Yemen" },
  { value: "ZMB", label: "Zambia" },
  { value: "ZWE", label: "Zimbabwe" },
] as const;

export enum ValidationStatusName {
  validation_status_not_approved = "validation_status_not_approved",
  validation_status_approved = "validation_status_approved",
  validation_status_on_hold = "validation_status_on_hold",
}
export enum ValidationStatusAdditionalName {
  no_status = "no_status",
  show_all = "show_all",
}
export type ValidationStatusOptionName = ValidationStatusName | ValidationStatusAdditionalName;

export interface ValidationStatusOption {
  value: ValidationStatusOptionName;
  label: string;
}

export enum AssetTypeName {
  question = "question",
  block = "block",
  template = "template",
  survey = "survey",
  collection = "collection",
  empty = "empty",
}
export type AssetFileType = "map_layer" | "form_media";

export enum GroupTypeBeginName {
  begin_group = "begin_group",
  begin_score = "begin_score",
  begin_rank = "begin_rank",
  begin_kobomatrix = "begin_kobomatrix",
  begin_repeat = "begin_repeat",
}
export enum GroupTypeEndName {
  end_group = "end_group",
  end_score = "end_score",
  end_rank = "end_rank",
  end_kobomatrix = "end_kobomatrix",
  end_repeat = "end_repeat",
}
export enum CollectionMethodName {
  offline_url = "offline_url",
  url = "url",
  single_url = "single_url",
  single_once_url = "single_once_url",
  iframe_url = "iframe_url",
  preview_url = "preview_url",
  android = "android",
}
export enum MetaQuestionTypeName {
  start = "start",
  end = "end",
  today = "today",
  username = "username",
  deviceid = "deviceid",
  phonenumber = "phonenumber",
  audit = "audit",
  "start-geopoint" = "start-geopoint",
}
export enum QuestionTypeName {
  acknowledge = "acknowledge",
  audio = "audio",
  "background-audio" = "background-audio",
  "background-geopoint" = "background-geopoint",
  barcode = "barcode",
  calculate = "calculate",
  date = "date",
  datetime = "datetime",
  decimal = "decimal",
  "xml-external" = "xml-external",
  file = "file",
  geopoint = "geopoint",
  geoshape = "geoshape",
  geotrace = "geotrace",
  hidden = "hidden",
  image = "image",
  integer = "integer",
  kobomatrix = "kobomatrix",
  note = "note",
  range = "range",
  rank = "rank",
  score = "score",
  select_multiple = "select_multiple",
  select_multiple_from_file = "select_multiple_from_file",
  select_one = "select_one",
  select_one_from_file = "select_one_from_file",
  text = "text",
  time = "time",
  video = "video",
}
export enum MiscRowTypeName {
  score__row = "score__row",
  rank__level = "rank__level",
}

export type AnyRowTypeName =
  | QuestionTypeName
  | MetaQuestionTypeName
  | GroupTypeBeginName
  | GroupTypeEndName
  | MiscRowTypeName;
export type AssetsBulkAction = "archive" | "delete" | "unarchive";

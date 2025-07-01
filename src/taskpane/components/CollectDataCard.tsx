import {
  Card,
  CardHeader,
  Divider,
  Dropdown,
  Option,
  Switch,
  Toolbar,
  ToolbarButton,
  Tooltip,
} from "@fluentui/react-components";
import { useState } from "react";
import { CopyIcon, LinkIcon } from "./primitives/icons";
import {
  useAddAnonymousSubmissionPermission,
  useDeleteAnonymousSubmissionPermission,
  usePermissionAssignments,
} from "../hooks/usePermission";
import { useStoredToken } from "../hooks/useStoredToken";

interface CollectDataCardProps {
  deploymentLinks: {
    iframe_url: string;
    offline_url: string;
    preview_url: string;
    single_iframe_url: string;
    single_once_iframe_url: string;
    single_once_url: string;
    single_url: string;
    url: string;
  };
  assetUid: string;
}

export const CollectDataCard = ({ deploymentLinks, assetUid }: CollectDataCardProps) => {
  const { kpiUrl } = useStoredToken();
  const { data: permissions } = usePermissionAssignments(assetUid);
  const AnonymousSubmissionMutation = useAddAnonymousSubmissionPermission();
  const DeleteAnonymousSubmissionMutation = useDeleteAnonymousSubmissionPermission();

  const anonymousPermission = permissions?.find(
    (perm: any) =>
      perm.user.includes("/api/v2/users/AnonymousUser/") &&
      perm.permission.includes("/api/v2/permissions/add_submissions/") &&
      perm.label === "Add submissions"
  );

  const isAnonymousSubmissionEnabled = !!anonymousPermission;

  const handleAnonymousSubmission = () => {
    AnonymousSubmissionMutation.mutate({
      assetUid: assetUid,
      payload: {
        permission: `${kpiUrl}/api/v2/permissions/add_submissions/`,
        user: `${kpiUrl}/api/v2/users/AnonymousUser/`,
      },
    });
  };

  const handleDeleteAnonymousSubmission = () => {
    if (anonymousPermission?.url) {
      console.log(anonymousPermission.url);
      DeleteAnonymousSubmissionMutation.mutate({
        permissionUrl: anonymousPermission.url,
        assetUid,
      });
    }
  };

  const handleSwitchToggle = () => {
    if (isAnonymousSubmissionEnabled) {
      handleDeleteAnonymousSubmission();
    } else {
      handleAnonymousSubmission();
    }
  };

  const [selectedOption, setSelectedOption] = useState("offline_url");

  const options = [
    {
      label: "Online-Offline (multiple submission)",
      value: "offline_url",
      description:
        "This allows online and offline submissions and is the best option for collecting data in the field.",
    },
    {
      label: "Online-Only (multiple submissions)",
      value: "url",
      description:
        "This is the best option when entering many records at once on a computer, e.g. for transcribing paper records.",
    },
    {
      label: "Online-Only (single submission)",
      value: "single_url",
      description:
        "This allows a single submission, and can be paired with the 'return_url' parameter to redirect the user to a URL of your choice after the form has been submitted.",
    },
    {
      label: "Online-only (once per respondent)",
      value: "single_once_url",
      description:
        "This allows your web form to only be submitted once per user, using basic protection to prevent the same user (on the same browser & device) from submitting more than once.",
    },
    {
      label: "Embeddable web form code",
      value: "iframe_url",
      description:
        "Use this html5 code snippet to integrate your form on your own website using smaller margins.",
    },
    {
      label: "View only",
      value: "preview_url",
      description:
        "Use this version for testing, getting feedback. Does not allow submitting data.",
    },
  ];

  const getCurrentUrl = () => {
    return deploymentLinks[selectedOption as keyof typeof deploymentLinks];
  };

  const getCurrentLabel = () => {
    const option = options.find((opt) => opt.value === selectedOption);
    return option?.label || "Select an option";
  };

  const getCurrentDescription = () => {
    const option = options.find((opt) => opt.value === selectedOption);
    return option?.description || "";
  };

  const handleCopy = async () => {
    const url = getCurrentUrl();
    if (selectedOption === "iframe_url") {
      const embedCode = `<iframe src="${url}" width="800" height="600"></iframe>`;
      await navigator.clipboard.writeText(embedCode);
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleOpen = () => {
    const url = getCurrentUrl();
    window.open(url, "_blank");
  };

  const shouldShowOpenButton = selectedOption !== "iframe_url";

  return (
    <div className="flex flex-col gap-2 pt-2 ">
      <span className="text-sm font-medium ">Collect data</span>
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
      >
        <CardHeader
          header={
            <Dropdown
              value={getCurrentLabel()}
              onOptionSelect={(_, data) => {
                if (data.optionValue) {
                  setSelectedOption(data.optionValue);
                }
              }}
              placeholder="Select deployment type"
              className="w-full rounded-md mb-2"
            >
              {options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Dropdown>
          }
          description={<span className="text-xs">{getCurrentDescription()}</span>}
        />
        {selectedOption === "iframe_url" && (
          <div
            style={{
              backgroundColor: "var(--colorNeutralBackground2)",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid var(--colorNeutralStroke2)",
              fontFamily: "monospace",
              fontSize: "13px",
              overflow: "auto",
            }}
          >
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {`<iframe src="${getCurrentUrl()}" width="800" height="600"></iframe>`}
            </pre>
          </div>
        )}
        <Toolbar size="small" className="flex flex-row items-center justify-end">
          <Tooltip content={"Copy"} relationship="label" withArrow>
            <ToolbarButton appearance="subtle" icon={<CopyIcon />} onClick={handleCopy} />
          </Tooltip>
          {shouldShowOpenButton && (
            <Tooltip content={"Open"} relationship="label" withArrow>
              <ToolbarButton appearance="subtle" icon={<LinkIcon />} onClick={handleOpen} />
            </Tooltip>
          )}
        </Toolbar>
        <Divider />
        <div className="flex flex-row items-center">
          <Switch checked={isAnonymousSubmissionEnabled} onChange={handleSwitchToggle} />
          Allow submissions to this form without a username and password
        </div>
      </Card>
    </div>
  );
};

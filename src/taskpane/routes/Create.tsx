import {
  Button,
  Toaster,
  useId,
  Card,
  CardHeader,
  Caption1,
  CardPreview,
  Text,
} from "@fluentui/react-components";
import {
  DocumentAdd24Filled,
  Link24Regular,
  DocumentText24Regular,
  Add24Regular,
  DocumentBulletList16Regular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { CreateXlsFormsByFileUpload } from "../components/dialogs/CreateProjectByFileUpload";
import { CreateXlsFormsByUrlUpload } from "../components/dialogs/CreateProjectByUrlUpload";
import { CreateEmptySurveyAsset } from "../components/dialogs/CreateEmptySurveyAsset";
import { CreateXlsFormsByWorkbookUpload } from "../components/dialogs/CreateProjectByWorkbookUpload";
import { useStoredToken } from "../hooks/AuthProvider";
import { useNavigate } from "react-router";
import { SettingsIcon } from "../components/primitives/icons";

type DialogType = "xlsUpload" | "xlsUrlUpload" | "workbookUpload" | "emptyAsset";

const Create = () => {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const toasterId = useId("toaster");
  const { token, kpiUrl } = useStoredToken();
  const navigate = useNavigate();

  if (!token || !kpiUrl) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card
          style={{
            backgroundColor: "var(--colorNeutralBackground3)",
          }}
          appearance="filled-alternative"
          className="w-full border-l-4 border-l-orange-400"
        >
          <CardPreview className="p-3">
            <div className="flex flex-col gap-2">
              <div className="text-orange-700 w-full font-semibold">Setup Required</div>
              <Text
                style={{
                  color: "var(--colorNeutralForeground3Hover)",
                }}
                size={100}
                className=" mb-2"
              >
                Configure your account to get started
              </Text>
              <Button
                appearance="primary"
                size="small"
                icon={<SettingsIcon />}
                onClick={() => navigate("/token-manager")}
                className="float-right"
              >
                Setup Account
              </Button>
            </div>
          </CardPreview>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4 min-h-screen">
      <Toaster toasterId={toasterId} />

      <div className="space-y-1 flex flex-col">
        <span className="text-base font-medium">Create New Project</span>
        <Caption1 className="text-sm italic">Select a method to begin creating your form</Caption1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            image={<DocumentAdd24Filled />}
            header="Upload Current Workbook"
            description="Create a project by uploading your current workbook."
          />
          <div className="p-4">
            <Button
              appearance="primary"
              onClick={() => setActiveDialog("workbookUpload")}
              icon={<DocumentBulletList16Regular />}
            >
              Upload Workbook
            </Button>
          </div>
        </Card>
        <Card>
          <CardHeader
            image={<DocumentAdd24Filled />}
            header="Upload XLSForm File"
            description="Create a project by uploading your XLSX file."
          />
          <div className="p-4">
            <Button
              appearance="primary"
              onClick={() => setActiveDialog("xlsUpload")}
              icon={<DocumentText24Regular />}
            >
              Upload XLSX File
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader
            image={<Link24Regular />}
            header="Link to XLSForm"
            description="Create a project by providing a public URL to the XLSX file."
          />
          <div className="p-4">
            <Button
              appearance="primary"
              onClick={() => setActiveDialog("xlsUrlUpload")}
              icon={<Link24Regular />}
            >
              Use XLSX URL
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader
            image={<Add24Regular />}
            header="Start from Scratch"
            description="Create an empty survey project and build it manually."
          />
          <div className="p-4">
            <Button
              appearance="primary"
              onClick={() => setActiveDialog("emptyAsset")}
              icon={<Add24Regular />}
            >
              Create Empty Asset
            </Button>
          </div>
        </Card>
      </div>

      <CreateXlsFormsByFileUpload
        open={activeDialog === "xlsUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <CreateXlsFormsByUrlUpload
        open={activeDialog === "xlsUrlUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <CreateEmptySurveyAsset
        open={activeDialog === "emptyAsset"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <CreateXlsFormsByWorkbookUpload
        open={activeDialog === "workbookUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
    </div>
  );
};

export default Create;

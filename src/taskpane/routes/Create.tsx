import { Button, Toaster, useId, Card, CardHeader, Caption1 } from "@fluentui/react-components";
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
import { exportOfficeDocumentAsBase64 } from "../../utils/officeUtils";

type DialogType = "xlsUpload" | "xlsUrlUpload" | "workbookUpload" | "emptyAsset";

const Create = () => {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const toasterId = useId("toaster");
  const handleExportClick = async () => {
    try {
      const base64 = await exportOfficeDocumentAsBase64();
      console.log("Exported base64 string:", base64);
    } catch (err) {
      console.error("Failed to export document:", err);
    }
  };
  return (
    <div className="space-y-2 p-2">
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
              // onClick={() => setActiveDialog("workbookUpload")}
              onClick={handleExportClick}
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
    </div>
  );
};

export default Create;

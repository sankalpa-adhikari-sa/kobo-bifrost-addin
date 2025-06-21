import { Button, Toaster, useId } from "@fluentui/react-components";
import CreateEmptySurveyAsset from "../components/CreateEmptySurveyAsset";
import { useState } from "react";
import { CreateXlsFormsByFileUpload } from "../components/dialogs/CreateProjectByFileUpload";
import { CreateXlsFormsByUrlUpload } from "../components/dialogs/CreateProjectByUrlUpload";
type DialogType = "xlsUpload" | "xlsUrlUpload" | "viewPreview";

const Create = () => {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const toasterId = useId("toaster");
  return (
    <div>
      <Toaster toasterId={toasterId} />
      <Button onClick={() => setActiveDialog("xlsUpload")}>
        Create Project XLSX Upload (moudlar){" "}
      </Button>
      <CreateEmptySurveyAsset />

      <Button onClick={() => setActiveDialog("xlsUrlUpload")}>Create Project XLSX link</Button>
      <Button>Upload Current Workbook</Button>
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
    </div>
  );
};
export default Create;

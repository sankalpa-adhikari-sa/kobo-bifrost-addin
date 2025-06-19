import { Button } from "@fluentui/react-components";
import CreateEmptySurveyAsset from "../components/CreateEmptySurveyAsset";
import CreateProjectFileUpload from "../components/CreateProjectFileUpload";

const Create = () => {
  return (
    <div>
      <CreateEmptySurveyAsset />
      <CreateProjectFileUpload />
      <Button>Upload XLSX link</Button>
      <Button>Upload Current Workbook</Button>
    </div>
  );
};
export default Create;

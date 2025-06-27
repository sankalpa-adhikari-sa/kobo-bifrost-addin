import { Button } from "@fluentui/react-components";
import { XLSFormValidation } from "../../utils/office/validation";
import { addMultipleConditionalFormatting } from "../../utils/office/conditionalFormatting";

export const Workbook = () => {
  const handleValidateSheet = async () => {
    const res = await XLSFormValidation();
    console.log("Validation Sheet:", res);
  };
  const handleConditionalFormatting = async () => {
    await addMultipleConditionalFormatting();
  };

  return (
    <div className="px-4 pt-4 min-h-screen flex flex-col gap-2 ">
      <Button>create a skeleton xls form</Button>
      <Button onClick={handleConditionalFormatting}>Conditionally format xls form</Button>
      <Button onClick={handleValidateSheet}>ValidateSheet</Button>
    </div>
  );
};

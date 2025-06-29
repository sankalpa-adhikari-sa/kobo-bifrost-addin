import { Button } from "@fluentui/react-components";
import { XLSFormValidation } from "../../utils/office/validation";
import { addMultipleConditionalFormatting } from "../../utils/office/conditionalFormatting";
import {
  useDestructiveStyles,
  useSuccessStyles,
  useWarningStyles,
} from "../components/primitives/styles";
import { CallEndRegular } from "@fluentui/react-icons";

export const Workbook = () => {
  const handleValidateSheet = async () => {
    const res = await XLSFormValidation();
    console.log("Validation Sheet:", res);
  };
  const handleConditionalFormatting = async () => {
    await addMultipleConditionalFormatting();
  };
  const warningStyles = useWarningStyles();
  const destructiveStyles = useDestructiveStyles();
  const successStyles = useSuccessStyles();
  return (
    <div className="px-4 pt-4 min-h-screen flex flex-col gap-2 ">
      <Button appearance="primary" disabled={true}>
        create a skeleton xls form
      </Button>
      <Button onClick={handleConditionalFormatting}>Conditionally format xls form</Button>
      <Button
        disabled={true}
        className={warningStyles.warning}
        icon={{ className: warningStyles.warningIcon, children: <CallEndRegular /> }}
      >
        Warning
      </Button>
      <Button
        disabled={true}
        className={successStyles.success}
        icon={{ className: successStyles.successIcon, children: <CallEndRegular /> }}
      >
        Success
      </Button>
      <Button
        disabled={true}
        className={destructiveStyles.destructive}
        icon={{ className: destructiveStyles.destructiveIcon, children: <CallEndRegular /> }}
      >
        Destructive
      </Button>
      <Button appearance="primary" onClick={handleValidateSheet}>
        ValidateSheet
      </Button>
    </div>
  );
};

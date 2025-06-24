import { ReactNode } from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from "@fluentui/react-components";

interface ReusableDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
  showActions?: boolean;
  maxWidth?: string;
}

export const ReusableDialog = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  isLoading = false,
  submitDisabled = false,
  showActions = true,
  maxWidth = "max-w-xl",
}: ReusableDialogProps) => {
  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog modalType="alert" open={open} onOpenChange={(_, data) => !data.open && handleClose()}>
      <DialogSurface className={`${maxWidth} w-full rounded-lg shadow-2xl`}>
        <DialogBody>
          <DialogTitle className="text-sm font-bold mb-4 border-b pb-2">{title}</DialogTitle>
          <DialogContent className="overflow-y-auto max-h-[70vh] pr-2">{children}</DialogContent>
          {showActions && (
            <DialogActions className="pt-4 flex justify-end gap-2">
              {onSubmit && (
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={isLoading || submitDisabled}
                  onClick={onSubmit}
                >
                  {isLoading ? "Processing..." : submitText}
                </Button>
              )}
              <Button appearance="secondary" onClick={handleClose} disabled={isLoading}>
                {cancelText}
              </Button>
            </DialogActions>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

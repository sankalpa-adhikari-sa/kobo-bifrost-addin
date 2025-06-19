import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Field,
  Textarea,
} from "@fluentui/react-components";

interface EditMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  asset: any;
}

export const EditMetadataDialog = ({ open, onClose, asset }: EditMetadataDialogProps) => {
  if (!asset) return null;

  const handleSave = () => {
    console.log("Saving metadata...");
    onClose();
  };

  return (
    <Dialog modalType="modal" open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className="max-w-xl w-full rounded-lg shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <DialogBody>
            <DialogTitle className="text-lg font-bold mb-4 border-b pb-2">
              Edit Project Metadata
            </DialogTitle>
            <DialogContent className="space-y-4">
              <p>
                Editing metadata for project: <strong>{asset.name}</strong>
              </p>
              <Field label="Project Description" required>
                <Textarea
                  defaultValue={asset.settings.description}
                  placeholder="Enter a description for your project"
                  rows={4}
                />
              </Field>
            </DialogContent>
            <DialogActions className="pt-4 flex justify-end gap-2">
              <Button type="submit" appearance="primary">
                Save
              </Button>
              <Button appearance="secondary" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};

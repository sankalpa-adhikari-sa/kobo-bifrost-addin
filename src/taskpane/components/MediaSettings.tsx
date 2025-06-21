import { useDeleteMedia, useMedia } from "../hooks/useMedia";
import {
  Card,
  Body1,
  Caption1,
  Button,
  Spinner,
  makeStyles,
  useToastController,
  useId,
  Toast,
  ToastTitle,
  Toaster,
  tokens,
} from "@fluentui/react-components";
import {
  DocumentFilled,
  DocumentRegular,
  PersonFilled,
  CalendarFilled,
  ArrowDownloadFilled,
  ErrorCircleFilled,
  AddFilled,
  DeleteRegular,
  bundleIcon,
  DeleteFilled,
} from "@fluentui/react-icons";
import { useState } from "react";
import { MediaUpload } from "./dialogs/MediaUpload";

const useStyles = makeStyles({
  destructive: {
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
  destructiveIcon: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
  fileIcon: {
    fontSize: "32px",
    color: "#4F52B2",
    marginRight: "12px",
  },
  metadataIcon: {
    color: "#616161",
    marginRight: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
});

type DialogType = "mediaUpload";

const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

const MediaSettings = ({ assetUid }: { assetUid: string }) => {
  const styles = useStyles();
  const { data: mediaFiles, isLoading, isError } = useMedia(assetUid);
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const { mutate: deleteMediaMutation, isPending: isDeleteMediaPending } = useDeleteMedia();

  const handleMediaDelete = async (snapshotUid: string) => {
    deleteMediaMutation(
      {
        assetUid: assetUid,
        snapshotUid: snapshotUid,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Deleted Asset Updated</ToastTitle>
            </Toast>,
            { intent: "success" }
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="large" labelPosition="below" label="Loading media files..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ErrorCircleFilled className="text-red-600 text-4xl mb-4" />
        <Body1 className="text-lg font-semibold text-gray-700 mb-2">
          Failed to load media files
        </Body1>
        <Caption1 className="text-gray-500 max-w-md">
          There was an error retrieving the attached files. Please try again later.
        </Caption1>
      </div>
    );
  }

  const isEmpty = !mediaFiles || mediaFiles.count === 0;

  return (
    <div className="py-4">
      <Toaster toasterId={toasterId} />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <DocumentRegular className="text-gray-400 text-4xl mb-4" />
          <Body1 className="text-lg font-semibold text-gray-700 mb-2">No files attached</Body1>
          <Caption1 className="text-gray-500 max-w-md mb-4">
            There are no media files associated with this asset yet.
          </Caption1>
          <Button
            appearance="primary"
            icon={<AddFilled />}
            onClick={() => setActiveDialog("mediaUpload")}
          >
            Upload Files
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Attached Files <span className="text-gray-500">({mediaFiles.count})</span>
            </h2>
            <Button
              appearance="primary"
              icon={<AddFilled />}
              onClick={() => setActiveDialog("mediaUpload")}
            >
              Add new files
            </Button>
          </div>

          <div className={styles.grid}>
            {mediaFiles.results.map((file: any) => (
              <Card key={file.uid}>
                <div className="flex items-start">
                  <DocumentFilled className={styles.fileIcon} />
                  <div className="flex-1 min-w-0">
                    <Body1 className="font-medium text-gray-900 truncate">
                      {file.metadata.filename}
                    </Body1>

                    <div className="flex flex-row items-center justify-between mt-3">
                      <div>
                        <div className="flex flex-row items-center mt-2">
                          <PersonFilled className={styles.metadataIcon} />
                          <Caption1>{file.user__username || "Unknown user"}</Caption1>
                        </div>

                        <div className="flex flex-row items-center mt-2">
                          <CalendarFilled className={styles.metadataIcon} />
                          <Caption1>
                            {new Date(file.date_created).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Caption1>
                        </div>

                        <div className="flex flex-row items-center mt-2">
                          <Caption1 className="text-gray-600">
                            {file.metadata.mimetype || "Unknown type"}
                          </Caption1>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2">
                        <Button
                          disabled={isDeleteMediaPending}
                          onClick={() => handleMediaDelete(file.uid)}
                          icon={<DeleteIcon className={styles.destructiveIcon} />}
                          appearance="primary"
                          className={styles.destructive}
                        />
                        <Button
                          as="a"
                          href={file.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<ArrowDownloadFilled />}
                          appearance="primary"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <MediaUpload
        open={activeDialog === "mediaUpload"}
        onClose={() => setActiveDialog(null)}
        assetUid={assetUid}
      />
    </div>
  );
};

export default MediaSettings;

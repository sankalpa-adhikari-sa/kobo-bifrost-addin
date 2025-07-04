import { useState } from "react";
import {
  Dropdown,
  Option,
  Toolbar,
  ToolbarButton,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  TableCellLayout,
  Spinner,
  Button,
  Toast,
  ToastTitle,
  ToastBody,
  useToastController,
  useId,
  Toaster,
  Tooltip,
} from "@fluentui/react-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  NextIcon,
  PreviousIcon,
} from "./primitives/icons";
import { useActions, useActivity, useExportActivity } from "../hooks/useActivity";
import { actionOptions } from "../../utils/constants";
import { formatDate } from "../../utils/utils";

interface ActivityItem {
  uid: string;
  action: string;
  username: string;
  date_created: string;
  user__username?: string;
  extra_details?: {
    user_affected?: string;
  };
}

interface AssetActivityProps {
  assetUid: string;
}

export const AssetActivity = ({ assetUid }: AssetActivityProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState("NOT action:'add-submission'");
  const offset = (page - 1) * limit;

  const { data: assetActions, isLoading } = useActivity({
    assetUid,
    offset,
    limit,
    q,
  });

  const { data: actionsData } = useActions({ assetUid });
  const exportAssetActivityMutation = useExportActivity();
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const totalCount = assetActions?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const getEventDescription = (item: ActivityItem): string => {
    const actionOption = actionOptions.find((option) => option.name === item.action);
    if (!actionOption) {
      return `${item.user__username || item.username} performed ${item.action}`;
    }

    const username = item.user__username || item.username;
    const targetUser = item.extra_details?.user_affected;

    return actionOption.getMessage(username, targetUser);
  };

  const activityData =
    assetActions?.results?.map((item: ActivityItem) => ({
      id: item.uid,
      eventDescription: getEventDescription(item),
      date: formatDate(item.date_created, "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })) || [];

  const columns: TableColumnDefinition<(typeof activityData)[0]>[] = [
    createTableColumn<(typeof activityData)[0]>({
      columnId: "eventDescription",
      compare: (a, b) => a.eventDescription.localeCompare(b.eventDescription),
      renderHeaderCell: () => <span className="text-xs">Event Description</span>,
      renderCell: (item) => (
        <TableCellLayout className="text-xs">{item.eventDescription}</TableCellLayout>
      ),
    }),
    createTableColumn<(typeof activityData)[0]>({
      columnId: "date",
      compare: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      renderHeaderCell: () => "Date",
      renderCell: (item) => <TableCellLayout className="text-xs">{item.date}</TableCellLayout>,
    }),
  ];

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  const handleLimitChange = (_: unknown, data: { optionValue?: string }) => {
    if (data.optionValue) {
      setLimit(parseInt(data.optionValue));
      setPage(1);
    }
  };

  const handleActionFilterChange = (_: unknown, data: { optionValue?: string }) => {
    if (data.optionValue) {
      if (data.optionValue === "all") {
        setQ("NOT action:'add-submission'");
      } else {
        setQ(`action:'${data.optionValue}'`);
      }
      setPage(1);
    }
  };

  const getActionLabel = (actionName: string): string => {
    const actionOption = actionOptions.find((option) => option.name === actionName);
    return actionOption ? actionOption.label : actionName;
  };

  const getCurrentFilterValue = (): string => {
    if (q === "NOT action:'add-submission'") return "all";
    const match = q.match(/action:'([^']+)'/);
    return match ? match[1] : "all";
  };

  const getCurrentFilterLabel = (): string => {
    const currentValue = getCurrentFilterValue();
    if (currentValue === "all") return "All Actions";
    return getActionLabel(currentValue);
  };

  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;
  const hasNoData = !isLoading && totalCount === 0;
  const shouldShowData = !isLoading && activityData.length > 0;

  const handleExportAssetActivity = () => {
    exportAssetActivityMutation.mutate(
      { assetUid: assetUid },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Exporting data</ToastTitle>
              <ToastBody subtitle="Success">
                Your export request is currently being processed. Once the export is complete,
                you'll receive an email with all the details.
              </ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Export Failed</ToastTitle>
              <ToastBody subtitle="Error">Failed to export an Asse Activity</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  return (
    <div className="mt-2">
      <Toaster toasterId={toasterId} />
      <h4 className="text-base font-medium">Recent Project Activity</h4>
      {actionsData?.actions && (
        <div className="flex flex-row items-center justify-between gap-4 my-2">
          {totalCount > 0 && !isLoading && (
            <div className="text-xs text-[var(--colorNeutralForeground3)]">
              Showing {Math.min((page - 1) * limit + 1, totalCount)} to{" "}
              {Math.min(page * limit, totalCount)} of {totalCount} items
            </div>
          )}
          <div className="flex flex-row gap-2">
            <Dropdown
              size="small"
              selectedOptions={[getCurrentFilterValue()]}
              value={getCurrentFilterLabel()}
              onOptionSelect={handleActionFilterChange}
              style={{ minWidth: "180px" }}
              disabled={isLoading}
            >
              <Option value="all">All Actions</Option>
              {(actionsData?.actions || []).map((action: string) => (
                <Option className="capitalize" key={action} value={action}>
                  {getActionLabel(action)}
                </Option>
              ))}
            </Dropdown>
            <Tooltip content={"Export all activity"} relationship="description" withArrow>
              <Button
                onClick={handleExportAssetActivity}
                icon={<DownloadIcon />}
                size="small"
                appearance="primary"
                disabled={exportAssetActivityMutation.isPending}
              />
            </Tooltip>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Spinner size="medium" />
        </div>
      ) : shouldShowData ? (
        <div>
          <div style={{ overflowX: "auto", maxWidth: "100%" }}>
            <DataGrid
              items={activityData}
              columns={columns}
              sortable
              getRowId={(item) => item.id}
              focusMode="row_unstable"
              style={{
                minWidth: "300px",
                backgroundColor: "var(--colorNeutralBackground3)",
                borderRadius: "4px",
              }}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<(typeof activityData)[0]>>
                {({ item, rowId }) => (
                  <DataGridRow<(typeof activityData)[0]> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Toolbar size="small">
              <ToolbarButton
                icon={<PreviousIcon />}
                onClick={handleFirstPage}
                disabled={isFirstPage || isLoading}
              />
              <ToolbarButton
                icon={<ChevronLeftIcon />}
                onClick={handlePrevious}
                disabled={isFirstPage || isLoading}
              />

              <span className="text-xs" style={{ margin: "0 8px" }}>
                Page {totalCount > 0 ? page : 0} of {totalPages || 0}
              </span>

              <ToolbarButton
                icon={<ChevronRightIcon />}
                onClick={handleNext}
                disabled={isLastPage || isLoading}
              />
              <ToolbarButton
                icon={<NextIcon />}
                onClick={handleLastPage}
                disabled={isLastPage || isLoading}
              />
            </Toolbar>
            <Dropdown
              size="small"
              value={limit.toString()}
              onOptionSelect={handleLimitChange}
              disabled={isLoading || hasNoData}
              style={{
                minWidth: "60px",
                padding: 0,
              }}
            >
              <Option value="10">10 rows</Option>
              <Option value="30">30 rows</Option>
              <Option value="50">50 rows</Option>
              <Option value="100">100 rows</Option>
            </Dropdown>
          </div>
        </div>
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No activity data available
        </div>
      )}
    </div>
  );
};

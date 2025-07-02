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
} from "@fluentui/react-components";
import { ChevronLeftIcon, ChevronRightIcon, NextIcon, PreviousIcon } from "./primitives/icons";
import { useActivity } from "../hooks/useActivity";
import { actionOptions } from "../../utils/constants";

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
  const offset = (page - 1) * limit;

  const { data: assetActions } = useActivity({
    assetUid,
    offset,
    limit,
  });

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

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const activityData =
    assetActions?.results?.map((item: ActivityItem) => ({
      id: item.uid,
      eventDescription: getEventDescription(item),
      date: formatDate(item.date_created),
    })) || [];

  const columns: TableColumnDefinition<(typeof activityData)[0]>[] = [
    createTableColumn<(typeof activityData)[0]>({
      columnId: "eventDescription",
      renderHeaderCell: () => <span className="text-xs">Event Description</span>,
      renderCell: (item) => (
        <TableCellLayout className="text-xs">{item.eventDescription}</TableCellLayout>
      ),
    }),
    createTableColumn<(typeof activityData)[0]>({
      columnId: "date",
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

  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;
  const hasNoData = totalCount === 0;

  return (
    <div>
      <h4>Recent Project Activity</h4>

      {totalCount > 0 && (
        <div style={{ fontSize: "0.875rem", color: "#666", margin: "8px 0" }}>
          Showing {Math.min((page - 1) * limit + 1, totalCount)} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} items
        </div>
      )}

      {activityData.length > 0 ? (
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

          <Toolbar size="small">
            <ToolbarButton
              icon={<PreviousIcon />}
              onClick={handleFirstPage}
              disabled={isFirstPage || hasNoData}
            />
            <ToolbarButton
              icon={<ChevronLeftIcon />}
              onClick={handlePrevious}
              disabled={isFirstPage || hasNoData}
            />

            <span style={{ margin: "0 8px" }}>
              Page {totalCount > 0 ? page : 0} of {totalPages || 0}
            </span>

            <ToolbarButton
              icon={<ChevronRightIcon />}
              onClick={handleNext}
              disabled={isLastPage || hasNoData}
            />
            <ToolbarButton
              icon={<NextIcon />}
              onClick={handleLastPage}
              disabled={isLastPage || hasNoData}
            />
            <Dropdown
              value={limit.toString()}
              onOptionSelect={handleLimitChange}
              disabled={hasNoData}
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
          </Toolbar>
        </div>
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No activity data available
        </div>
      )}
    </div>
  );
};

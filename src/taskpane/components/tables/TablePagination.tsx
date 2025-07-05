import { Dropdown, Option, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { ChevronLeftIcon, ChevronRightIcon, NextIcon, PreviousIcon } from "../primitives/icons";

interface TablePaginationProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  isLoading: boolean;
  hasNoData: boolean;
  handleFirstPage: () => void;
  handlePrevious: () => void;
  handleLimitChange: (_: unknown, data: { optionValue?: string }) => void;
  handleLastPage: () => void;
  handleNext: () => void;
  limit: number;
  totalCount: number;
  totalPages: number;
  page: number;
}

export const TablePagination = (props: TablePaginationProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <Toolbar size="small">
        <ToolbarButton
          icon={<PreviousIcon />}
          onClick={props.handleFirstPage}
          disabled={props.isFirstPage || props.isLoading}
        />
        <ToolbarButton
          icon={<ChevronLeftIcon />}
          onClick={props.handlePrevious}
          disabled={props.isFirstPage || props.isLoading}
        />

        <span className="text-xs" style={{ margin: "0 8px" }}>
          Page {props.totalCount > 0 ? props.page : 0} of {props.totalPages || 0}
        </span>

        <ToolbarButton
          icon={<ChevronRightIcon />}
          onClick={props.handleNext}
          disabled={props.isLastPage || props.isLoading}
        />
        <ToolbarButton
          icon={<NextIcon />}
          onClick={props.handleLastPage}
          disabled={props.isLastPage || props.isLoading}
        />
      </Toolbar>
      <Dropdown
        size="small"
        value={props.limit.toString()}
        onOptionSelect={props.handleLimitChange}
        disabled={props.isLoading || props.hasNoData}
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
  );
};

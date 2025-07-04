import { Button, Card, Divider } from "@fluentui/react-components";

import { useSubmissionCounts } from "../../hooks/useData";
import { LoadingSkeleton } from "../primitives/LoadingSkeleton";
import { useState } from "react";

interface SubmissionData {
  daily_submission_counts: Record<string, number>;
  total_submission_count: number;
}

export const SubmissionsCard = ({ assetUid }: { assetUid: string }) => {
  const [selectedDays, setSelectedDays] = useState<number>(31);

  const { data: submissionsCount, isLoading: isSubmissionsCountLoading } = useSubmissionCounts({
    assetUid,
    days: selectedDays,
  }) as { data: SubmissionData | undefined; isLoading: boolean };

  const timeRangeButtons = [
    { days: 7, label: "Past 7 days" },
    { days: 31, label: "Past 31 days" },
    { days: 93, label: "Past 93 days" },
    { days: 366, label: "Past 366 days" },
  ];

  const handleTimeRangeClick = (days: number) => {
    setSelectedDays(days);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Submissions</span>
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
          padding: "16px",
        }}
      >
        <div className="flex gap-2 mb-4 flex-wrap">
          {timeRangeButtons.map(({ days, label }) => (
            <Button
              key={days}
              appearance={selectedDays === days ? "primary" : "secondary"}
              onClick={() => handleTimeRangeClick(days)}
              disabled={isSubmissionsCountLoading}
            >
              {label}
            </Button>
          ))}
        </div>
        <Divider />
        <div className="flex items-center justify-between flex-row">
          <div className="text-left flex flex-col items-center">
            {isSubmissionsCountLoading ? (
              <LoadingSkeleton size={12} />
            ) : (
              <span className="text-2xl font-bold  text-[var(--colorBrandForeground2)]">
                {submissionsCount?.total_submission_count || 0}
              </span>
            )}
            <span className="text-xs text-[var(--colorNeutralForeground3)]">Total Submissions</span>
          </div>
          <div className="text-right  flex flex-col items-center">
            {isSubmissionsCountLoading ? (
              <LoadingSkeleton size={12} />
            ) : (
              <span className="text-2xl font-bold  text-[var(--colorBrandForeground2)]">
                {submissionsCount?.total_submission_count || 0}
              </span>
            )}
            <div className="text-xs text-[var(--colorNeutralForeground3)]">
              {selectedDays === 366 ? "Past year" : `Past ${selectedDays} days`}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

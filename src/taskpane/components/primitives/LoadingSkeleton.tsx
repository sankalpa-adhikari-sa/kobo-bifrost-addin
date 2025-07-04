import { Skeleton, SkeletonItem } from "@fluentui/react-components";

const SIZES = [8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128] as const;

type SkeletonSize = (typeof SIZES)[number];
export const LoadingSkeleton = ({ size }: { size: SkeletonSize }) => {
  return (
    <Skeleton aria-label="Loading Content">
      <SkeletonItem size={size} />
    </Skeleton>
  );
};

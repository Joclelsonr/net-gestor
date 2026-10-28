import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable() {
  return (
    <div className="flex w-full flex-col gap-2 mt-6">
      <div className="w-full py-4">
        <Skeleton className="h-6" />
      </div>

      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-4 " key={index}>
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 w-36 md:table-cell" />
          <Skeleton className="hidden w-24 md:h-6 md:table-cell" />
          <Skeleton className="hidden w-24 md:h-6 md:table-cell" />
          <Skeleton className="h-6 w-20 md:table-cell" />
        </div>
      ))}
    </div>
  );
}

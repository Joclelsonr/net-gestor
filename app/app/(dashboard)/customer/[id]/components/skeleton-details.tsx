import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonDetails() {
  return (
    <>
      <div>
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="space-y-2">
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
        <Card className="space-y-2">
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 space-y-3">
        <Skeleton className="w-full h-32 " />
      </div>
    </>
  );
}

import { Suspense } from "react";

import { CustomerDetails } from "./components/customer-details";
import { SkeletonDetails } from "./components/skeleton-details";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  return (
    <div className="mx-auto w-full p-6 md:p-10">
      <Suspense fallback={<SkeletonDetails />}>
        <CustomerDetails params={params} />
      </Suspense>
    </div>
  );
}

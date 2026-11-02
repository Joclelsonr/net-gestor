import { Suspense } from "react";

import { ShowPlans } from "./components/show-plans";
import { PlanSection } from "./components/plan-section";
import { SkeletonPlans } from "./components/skeleton-plans";

export default function Page() {
  return (
    <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
      <PlanSection />

      <Suspense fallback={<SkeletonPlans />}>
        <ShowPlans />
      </Suspense>
    </div>
  );
}

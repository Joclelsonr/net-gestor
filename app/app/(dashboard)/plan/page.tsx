import { Suspense } from "react";

import { ShowPlans } from "./components/show-plans";
import { PlanSection } from "./components/plan-section";

export default function Page() {
  return (
    <div className="mx-auto w-full p-6 md:p-10">
      <PlanSection />

      <Suspense
        fallback={
          <div className="mt-6">
            <p className="text-muted-foreground">Carregando planos...</p>
          </div>
        }
      >
        <ShowPlans />
      </Suspense>
    </div>
  );
}

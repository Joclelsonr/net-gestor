import { Suspense } from "react";

import { EditComponent } from "./components/edit-component";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  return (
    <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
      <Suspense fallback={<div>Loading...</div>}>
        <EditComponent params={params} />
      </Suspense>
    </div>
  );
}

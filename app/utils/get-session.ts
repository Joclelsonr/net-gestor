import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!session?.user) return redirect("/login");

  return { user: session?.user, session: session?.session };
}

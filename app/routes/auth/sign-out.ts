import { redirect } from "react-router";
import { signOut } from "~/lib/auth.server";
import type { Route } from "./+types/sign-out";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  const result = await signOut(request);

  return redirect("/sign-in", {
    headers: result.headers,
  });
}

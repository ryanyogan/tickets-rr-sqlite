import { data, Outlet } from "react-router";
import { requireUser } from "~/lib/session.server";
import type { Route } from "./+types/account-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return data({ user });
}

export default function AccountLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Outlet />
    </>
  );
}

import { data, Link, redirect, type MetaFunction } from "react-router";
import { CardCompact } from "~/components/card-compact";
import { SignInForm } from "~/features/auth/components/sign-in-form";
import { signIn } from "~/lib/auth.server";
import { getUserFromSession } from "~/lib/session.server";
import { passwordForgotPath, signUpPath } from "~/paths";
import type { Route } from "./+types/sign-up";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign in to access all features" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  if (user) {
    return redirect("/tickets");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = await signIn(request, formData);

  if (!result.success) {
    return data(result);
  }

  // Get redirect URL from search params or use default
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/tickets";

  return redirect(redirectTo, {
    headers: result.headers,
  });
}

export default function SignUpPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen">
      <div>
        {actionData?.message && !actionData.success && (
          <div className="text-red-500">{actionData.message}</div>
        )}
      </div>

      <CardCompact
        title="Sign In"
        description="Log in to access your account"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignInForm />}
        footer={
          <div className="flex w-full justify-between">
            <Link to={signUpPath()} className="text-sm text-muted-foreground">
              No account yet?
            </Link>
            <Link
              to={passwordForgotPath()}
              className="text-sm text-muted-foreground"
            >
              Forgot Password?
            </Link>
          </div>
        }
      />
    </div>
  );
}

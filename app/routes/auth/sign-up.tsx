import { data, Link, redirect, type MetaFunction } from "react-router";
import { CardCompact } from "~/components/card-compact";
import { SignUpForm } from "~/features/auth/components/sign-up-form";
import { signUp } from "~/lib/auth.server";
import { getUserFromSession } from "~/lib/session.server";
import { signInPath } from "~/paths";
import type { Route } from "./+types/sign-up";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up" },
    {
      name: "description",
      content: "Create an account to access all features",
    },
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
  const result = await signUp(request, formData);

  if (!result.success) {
    return data(result);
  }

  return redirect("/tickets", {
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
        title="Sign Up"
        description="Create an account to access all features."
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignUpForm />}
        footer={
          <Link to={signInPath()} className="text-sm text-muted-foreground">
            Have an account? Sign In now
          </Link>
        }
      />
    </div>
  );
}

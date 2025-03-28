import { useFetcher } from "react-router";
import { SubmitButton } from "~/components/form/submit-button";
import { Input } from "~/components/ui/input";

export function SignInForm() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" className="flex flex-col gap-y-2">
      <Input name="email" placeholder="Email" autoComplete="email" />

      <Input
        name="password"
        placeholder="Password"
        type="password"
        autoComplete="new-password"
      />

      <SubmitButton pending={fetcher.state !== "idle"} label="Sign In" />
    </fetcher.Form>
  );
}

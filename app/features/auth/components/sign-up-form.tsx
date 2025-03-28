import { Form } from "react-router";
import { SubmitButton } from "~/components/form/submit-button";
import { Input } from "~/components/ui/input";

export function SignUpForm() {
  return (
    <Form method="post" className="flex flex-col gap-y-2">
      <Input name="username" placeholder="Username" autoComplete="username" />

      <Input
        name="email"
        placeholder="Email"
        autoComplete="email"
        type="email"
      />

      <Input
        name="password"
        placeholder="Password"
        type="password"
        autoComplete="new-password"
      />

      <Input
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        autoComplete="new-password"
      />

      <SubmitButton label="Sign Up" />
    </Form>
  );
}

import { LucideKanban, LucideLogOut } from "lucide-react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import { homePath, signInPath, signUpPath } from "~/paths";
import { SubmitButton } from "./form/submit-button";
import { ThemeSwitcher } from "./theme-switcher";
import { buttonVariants } from "./ui/button";

export function Header() {
  const { user } = useRouteLoaderData("root") as {
    user: { id: string; username: string } | null;
  };

  const fetcher = useFetcher();

  const navItems = user ? (
    <>
      <fetcher.Form action="/sign-out" method="post">
        <SubmitButton
          pending={fetcher.state !== "idle"}
          label="Sign Out"
          icon={<LucideLogOut />}
        />
      </fetcher.Form>
    </>
  ) : (
    <>
      <Link
        to={signUpPath()}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign Up
      </Link>
      <Link
        to={signInPath()}
        className={buttonVariants({ variant: "default" })}
      >
        Sign In
      </Link>
    </>
  );

  return (
    <nav
      className="supports-backdrop-blur:bg-background/60
          fixed left-0 right-0 top-0 z-20
          border-b bg-background/95 backdrop-blur
          w-full flex py-2.5 px-5 justify-between
          "
    >
      <div className="flex items-center gap-x-2">
        <Link to={homePath()} className={buttonVariants({ variant: "ghost" })}>
          <LucideKanban />
          <h1 className="text-lg font-semibold">TicketBounty</h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
}

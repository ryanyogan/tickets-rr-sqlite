import { cloneElement } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import { closedClassName } from "./constants";
import type { NavItem } from "./types";

type SidebarItemProps = {
  isOpen: boolean;
  navItem: NavItem;
};

export function SidebarItem({ isOpen, navItem }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === navItem.href;

  return (
    <Link
      to={navItem.href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "group relative flex h-12 justify-start",
        isActive && "bg-muted font-bold hover:bg-muted"
      )}
    >
      {cloneElement(
        navItem.icon as React.ReactElement<{ className?: string }>,
        {
          className: "size-5",
        }
      )}
      <span
        className={cn(
          "absolute left-12 text-base duration-200",
          isOpen ? "md:block hidden" : "w-[78px]",
          !isOpen && closedClassName
        )}
      >
        {navItem.title}
      </span>
    </Link>
  );
}

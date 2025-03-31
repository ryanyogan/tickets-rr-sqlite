import { cloneElement } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { closedClassName } from "./constants";
import type { NavItem } from "./types";

type SidebarItemProps = {
  isOpen: boolean;
  navItem: NavItem;
  isActive: boolean;
};

export function SidebarItem({ isOpen, navItem, isActive }: SidebarItemProps) {
  return (
    <>
      {navItem.separator && <Separator />}
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
    </>
  );
}

import { LucideSlash } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type BreadcumbsProps = {
  breadcumbs: {
    title: string;
    href?: string;
  }[];
};

export function Breadcrumbs({ breadcumbs }: BreadcumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcumbs.map((breadcrumb, index) => {
          let breadcrumItem = (
            <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
          );

          if (breadcrumb.href) {
            breadcrumItem = (
              <BreadcrumbLink asChild>
                <Link className="flex items-center gap-1" to={breadcrumb.href}>
                  {breadcrumb.title}
                </Link>
              </BreadcrumbLink>
            );
          }

          return (
            <Fragment key={breadcrumb.title}>
              <BreadcrumbItem>{breadcrumItem}</BreadcrumbItem>
              {index < breadcumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <LucideSlash className="size-4" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

import clsx from "clsx";
import { LucideLoaderCircle } from "lucide-react";
import { cloneElement } from "react";
import { useNavigation } from "react-router";
import { Button } from "../ui/button";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export function SubmitButton({
  label,
  icon,
  variant = "default",
  size = "default",
}: SubmitButtonProps) {
  const navigation = useNavigation();
  const pending = navigation.state !== "idle";

  return (
    <Button
      className="cursor-pointer"
      disabled={pending}
      type="submit"
      variant={variant}
      size={size}
    >
      {pending && (
        <LucideLoaderCircle
          className={clsx("size-4 animate-spin", { "mr-2": !!label })}
        />
      )}
      {label}
      {pending ? null : icon ? (
        <span className={clsx({ "ml-2": !!label })}>
          {cloneElement(icon, {
            className: "size-4",
          } as { className: string })}
        </span>
      ) : null}
    </Button>
  );
}

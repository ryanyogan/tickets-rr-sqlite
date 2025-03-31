import { cloneElement } from "react";

type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement<{ className?: string }>;
  button?: React.ReactElement<{ className?: string }>;
};

export function Placeholder({ label, icon, button }: PlaceholderProps) {
  return (
    <div className="flex-1 self-center flex flex-col items-center justify-center gap-y-2">
      {icon &&
        cloneElement(icon, {
          className: "size-16",
        })}

      <h2 className="text-lg text-center">{label}</h2>

      {button &&
        cloneElement(button, {
          className: "h-10",
        })}
    </div>
  );
}

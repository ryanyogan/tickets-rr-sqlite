import { replace, useLocation, useSearchParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Option = {
  value: string;
  label: string;
};

type SortSelectProps = {
  defaultValue?: string;
  options: Option[];
};

export function SortSelect({ defaultValue, options }: SortSelectProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === defaultValue) {
      params.delete("sort");
    } else if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    setSearchParams(params);

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      onValueChange={handleSort}
      defaultValue={searchParams.get("sort")?.toString() ?? defaultValue}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

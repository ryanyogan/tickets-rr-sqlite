import { useQueryState } from "nuqs";
import { sortParser } from "~/features/tickets/search-params";
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
  options: Option[];
};

export function SortSelect({ options }: SortSelectProps) {
  const [sort, setSort] = useQueryState("sort", sortParser);

  function handleSort(value: string) {
    setSort(value);
  }

  return (
    <Select onValueChange={handleSort} defaultValue={sort}>
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

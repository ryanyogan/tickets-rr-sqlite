import { useQueryStates } from "nuqs";
import { SortSelect, type SortSelectOption } from "~/components/sort-select";
import { sortOptions, sortParser } from "../search-params";

export function TicketSortSelect({ options }: { options: SortSelectOption[] }) {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  return <SortSelect value={sort} onChange={setSort} options={options} />;
}

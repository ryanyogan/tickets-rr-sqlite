import { useQueryState } from "nuqs";
import { SearchInput } from "~/components/search-input";
import { searchParser } from "../search-params";

export function TicketSearchInput({ placeholder }: { placeholder: string }) {
  const [search, setSearch] = useQueryState("search", searchParser);

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder={placeholder}
    />
  );
}

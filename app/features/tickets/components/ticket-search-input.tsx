import { useQueryState, useQueryStates } from "nuqs";
import { SearchInput } from "~/components/search-input";
import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "../search-params";

export function TicketSearchInput({ placeholder }: { placeholder: string }) {
  const [search, setSearch] = useQueryState("search", searchParser);
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );

  function handleSearch(value: string) {
    setPagination({ ...pagination, page: 0 });
    setSearch(value);
  }

  return (
    <SearchInput
      value={search}
      onChange={handleSearch}
      placeholder={placeholder}
    />
  );
}

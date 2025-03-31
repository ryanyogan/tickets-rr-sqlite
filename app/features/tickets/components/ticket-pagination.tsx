import { useQueryStates } from "nuqs";
import { Pagination } from "~/components/pagination";
import { paginationOptions, paginationParser } from "../search-params";

type TicketPaginationProps = {
  paginatedTicketMetadata: {
    count: number;
    hasNextPage: boolean;
  };
};

export function TicketPagination({
  paginatedTicketMetadata,
}: TicketPaginationProps) {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );

  return (
    <Pagination
      pagination={pagination}
      onPagination={setPagination}
      paginatedMetadata={paginatedTicketMetadata}
    />
  );
}

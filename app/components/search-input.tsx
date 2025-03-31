import { replace, useLocation, useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

export function SearchInput({ placeholder }: SearchInputProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.append("search", value);
      } else {
        params.delete("search");
      }

      setSearchParams(params);

      replace(`${pathname}?${params.toString()}}`);
    },
    250
  );

  return <Input placeholder={placeholder} onChange={handleSearch} />;
}

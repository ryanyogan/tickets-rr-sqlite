import { format } from "date-fns";
import { LucideCalendar } from "lucide-react";
import { useImperativeHandle, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
  imperativeHandleRef?: React.RefObject<ImperativeHandleFromDatePicker | null>;
};

export type ImperativeHandleFromDatePicker = {
  reset: () => void;
};

export function DatePicker({
  id,
  name,
  defaultValue,
  imperativeHandleRef,
}: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date()
  );
  const [open, setOpen] = useState(false);
  const formattedStringDate = date ? format(date, "yyyy-MM-dd") : "";

  useImperativeHandle(imperativeHandleRef, () => ({
    reset: () => setDate(new Date()),
  }));

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger id={id} className="w-full" asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal cursor-pointer"
        >
          <LucideCalendar className="mr-2 size-4" />
          {formattedStringDate}
          <input type="hidden" name={name} value={formattedStringDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

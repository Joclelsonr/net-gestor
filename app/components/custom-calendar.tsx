
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface CustomCalendarProps {
  label?: string;
  id?: string;
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomCalendar({
  label,
  id = "date",
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  disabled = false,
}: CustomCalendarProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              variant="outline"
              disabled={disabled}
              className="justify-start font-normal"
            >
              {selectedDate && !isNaN(selectedDate.getTime()) ? (
                format(selectedDate, "PPP", { locale: ptBR })
              ) : (
                <span className="text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </Button>
          }
        />

        <PopoverContent
          align="start"
          className="w-auto overflow-hidden p-0"
        >
          <Calendar
            mode="single"
            captionLayout="dropdown"
            locale={ptBR}
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={(date) => {
              onChange(date ? date.toISOString() : "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

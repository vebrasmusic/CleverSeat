"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function TypeDropdown() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  
  const types = [
    {
      value: "0.7",
      label: "Inner Family",
    },
    {
      value: "0.5",
      label: "Extended Family",
    },
    {
      value: "0.4",
      label: "Friend",
    },
    {
      value: "0.1",
      label: "Acquaintance",
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? types.find((type) => type.label === value)?.label
            : "Select type..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
            {types.map((type, index) => (
              <CommandItem
                key={index}
                value={type.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                {type.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === type.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

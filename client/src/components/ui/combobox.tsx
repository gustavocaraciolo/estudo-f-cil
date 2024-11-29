import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    )
  }
)
Combobox.displayName = "Combobox"

const ComboboxTrigger = PopoverTrigger

interface ComboboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  displayValue?: (value: string) => string
}

const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, displayValue, value, ...props }, ref) => {
    const display = displayValue ? displayValue(value as string) : value

    return (
      <Button
        variant="outline"
        role="combobox"
        className={cn(
          "w-full justify-between",
          !display && "text-muted-foreground",
          className
        )}
      >
        {display || props.placeholder}
      </Button>
    )
  }
)
ComboboxInput.displayName = "ComboboxInput"

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    className={cn("w-[200px] p-0", className)}
    {...props}
  >
    <Command>
      <CommandInput className="h-9" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>{children}</CommandGroup>
    </Command>
  </PopoverContent>
))
ComboboxContent.displayName = "ComboboxContent"

interface ComboboxItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandItem> {
  selected?: boolean
}

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  ComboboxItemProps
>(({ className, children, selected, ...props }, ref) => (
  <CommandItem
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    {selected && <Check className="h-4 w-4" />}
    {children}
  </CommandItem>
))
ComboboxItem.displayName = "ComboboxItem"

export {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
}

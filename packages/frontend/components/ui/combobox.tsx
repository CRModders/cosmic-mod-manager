import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, InfoIcon } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface ComboBoxItem {
    label: string;
    value: string;
    disabled?: boolean;
    disabledReason?: string;
}

interface ComboBoxProps {
    options: ComboBoxItem[];
    value: string;
    children: React.ReactNode;
    inputLabel?: string;
    setValue: (value: string) => void;
    footerItem?: React.ReactNode;
}

function ComboBox({ options, value, setValue, inputLabel, children, footerItem }: ComboBoxProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="p-0 sm:min-w-[28rem] thin-scrollbar">
                <Command>
                    <CommandInput placeholder={inputLabel || "Search..."} />
                    <TooltipProvider delayDuration={200}>
                        <CommandList className="">
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                        className={
                                            option?.disabled === true
                                                ? "text-danger-foreground data-[selected=true]:bg-shallow-background/50 data-[selected=true]:text-danger-foreground"
                                                : ""
                                        }
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                                        {option.label}
                                        {option?.disabled === true ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InfoIcon className="w-btn-icon h-btn-icon ml-auto mr-2" />
                                                </TooltipTrigger>

                                                <TooltipContent>{option?.disabledReason || "Disabled"}</TooltipContent>
                                            </Tooltip>
                                        ) : null}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </TooltipProvider>
                    {footerItem}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default ComboBox;

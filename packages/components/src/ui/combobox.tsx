import { Check, InfoIcon } from "lucide-react";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { cn } from "~/utils";
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
    inputBox?: boolean;
    inputLabel?: string;
    setValue: (value: string) => void;
    footerItem?: React.ReactNode;
    noResultsElem?: React.ReactNode;
}

function ComboBox(props: ComboBoxProps) {
    const [open, setOpen] = useState(false);

    const idToValueMap = new Map<string, string>();
    for (const option of props.options) {
        const id = `${option.value} ${option.label}`;
        idToValueMap.set(id, option.value);
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>{props.children}</PopoverTrigger>
            <PopoverContent className="p-0 sm:min-w-[28rem] border-none">
                <Command className="border border-shallow-background">
                    {props.inputBox === false ? null : <CommandInput placeholder={props.inputLabel || "Search..."} />}
                    <TooltipProvider delayDuration={200}>
                        <CommandList>
                            <CommandEmpty>{props.noResultsElem || "No results"}</CommandEmpty>
                            <CommandGroup>
                                {props.options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={`${option.value} ${option.label}`}
                                        onSelect={(currentValue) => {
                                            props.setValue(idToValueMap.get(currentValue) || "");
                                            setOpen(false);
                                        }}
                                        className={
                                            option?.disabled === true
                                                ? "text-danger-foreground data-[selected=true]:bg-shallow-background/50 data-[selected=true]:text-danger-foreground"
                                                : ""
                                        }
                                    >
                                        <Check className={cn("me-2 h-4 w-4", props.value === option.value ? "opacity-100" : "opacity-0")} />
                                        {option.label}
                                        {option?.disabled === true ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InfoIcon aria-hidden className="w-btn-icon h-btn-icon ms-auto me-2" />
                                                </TooltipTrigger>

                                                <TooltipContent>{option?.disabledReason || "Disabled"}</TooltipContent>
                                            </Tooltip>
                                        ) : null}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </TooltipProvider>
                    {props.footerItem}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default ComboBox;

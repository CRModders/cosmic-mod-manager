import { cn } from "@/lib/utils";
import { CheckIcon, SearchIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { Input } from "./input";
import "./styles.css";

interface MultiSelectItem {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: MultiSelectItem[];
    selectedOptions: string[];
    onChange: (selectedOptions: string[]) => void | Promise<void>;
    searchBar?: boolean;
    searchInputPlaceholder?: string;
    children: React.ReactNode;
    popupAlign?: "center" | "end" | "start";
    hideSelectedItems?: boolean;
    classNames?: {
        popupContent?: string;
        listItem?: string;
    };
    footerItem?: React.ReactNode;
}

export const MultiSelect = ({
    options,
    selectedOptions,
    onChange,
    searchBar,
    searchInputPlaceholder,
    popupAlign,
    hideSelectedItems,
    children,
    classNames,
    footerItem,
}: MultiSelectProps) => {
    const [focusedItem, setFocusedItem] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const listableItems = hideSelectedItems === true ? options.filter((option) => !selectedOptions.includes(option.value)) : options;
    const visibleItems = listableItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

    const scrollIntoView = (index = focusedItem) => {
        const id = `multiselect-option-${visibleItems[index]?.value}`;
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollIntoView({ behavior: "auto", block: "nearest" });
    };

    const focusNextItem = (scrollTargetIntoView = false) => {
        if (focusedItem < visibleItems.length - 1) {
            setFocusedItem((prev) => prev + 1);
            if (scrollTargetIntoView === true) scrollIntoView(focusedItem + 1);
        }
    };

    const focusPreviousItem = (scrollTargetIntoView = false) => {
        if (focusedItem > 0) {
            setFocusedItem((prev) => prev - 1);
            if (scrollTargetIntoView === true) scrollIntoView(focusedItem - 1);
        }
    };

    const handleSelect = (optionVal: string) => {
        if (!optionVal) return;
        if (selectedOptions.includes(optionVal)) {
            onChange(selectedOptions.filter((val) => val !== optionVal));
        } else {
            onChange([...selectedOptions, optionVal]);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                align={popupAlign || "center"}
                className={cn(
                    "p-1 flex flex-col gap-1 w-max min-w-40 max-w-md overscroll-contain border-shallower-background",
                    classNames?.popupContent,
                )}
                onKeyDown={(e) => {
                    if (e.ctrlKey || e.shiftKey || e.altKey) return;
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        focusNextItem(true);
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        focusPreviousItem(true);
                    } else if (e.key === "Enter") {
                        e.preventDefault();
                        handleSelect(visibleItems[focusedItem]?.value);
                    }
                }}
            >
                {(options.length > 5 || searchBar === true) && searchBar !== false ? (
                    <div className="w-full flex relative items-center justify-center">
                        <SearchIcon className="w-btn-icon h-btn-icon text-extra-muted-foreground absolute top-[50%] left-2.5 translate-y-[-50%]" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value || "")}
                            placeholder={searchInputPlaceholder || "Search..."}
                            className="w-auto max-w-full !pl-8 no_focus_ring border border-shallow-background no_neumorphic_shadow"
                        />
                    </div>
                ) : null}
                <ul className="w-full flex flex-col items-start justify-start max-h-72 overflow-y-auto gap-0.5">
                    {visibleItems.map((option, index) => {
                        const isFocused = option.value === visibleItems[focusedItem]?.value;
                        const isSelected = selectedOptions.includes(option.value);

                        return (
                            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                            <li
                                className={cn(
                                    "w-full text-sm flex items-center justify-start py-1.5 pl-3 pr-2 gap-x-4 rounded cursor-default text-muted-foreground",
                                    isFocused && "bg-shallow-background text-foreground",
                                    isSelected && "text-foreground-bright",
                                    classNames?.listItem,
                                )}
                                id={`multiselect-option-${option.value}`}
                                key={option.value}
                                onClick={() => {
                                    handleSelect(option.value);
                                }}
                                onMouseEnter={() => {
                                    setFocusedItem(index);
                                }}
                            >
                                {option.label}
                                <span className="ml-auto shrink-0 min-w-6 flex items-center justify-center">
                                    {isSelected ? <CheckIcon className="w-btn-icon h-btn-icon" /> : null}
                                </span>
                            </li>
                        );
                    })}
                    {visibleItems?.length === 0 ? (
                        <li className="w-full flex items-center justify-center py-4">
                            <span className="text-extra-muted-foreground italic">No results</span>
                        </li>
                    ) : null}
                </ul>
                {footerItem}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

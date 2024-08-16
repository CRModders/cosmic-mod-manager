import { cn } from "@/lib/utils";
import useMultiSelect from "@/src/hooks/multi-select";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { XIcon } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import "./styles.css";

type Props = {
    inputPlaceholder: string;
    inputId: string;
    initialSelectedItems?: string[];
    options: string[];
    setSelectedValues?: (values: string[]) => void;
    inputName?: string;
};

export function MultiSelectInput({ inputName, inputPlaceholder, initialSelectedItems, inputId, options, setSelectedValues }: Props) {
    const listScrollContainer = useRef<HTMLDivElement>(null);
    const { visibleList, searchTerm, setSearchTerm, selectedItems, setSelectedItems } = useMultiSelect({
        options,
        initialSelectedItems,
    });
    const [focusedListItemIndex, setFocusedListItemIndex] = useState<number>(0);

    const changeFocusedItem = (indexShift = 1) => {
        if (focusedListItemIndex + indexShift < visibleList.length && focusedListItemIndex + indexShift >= 0)
            setFocusedListItemIndex((prev) => prev + indexShift);
    };

    const AddItemToSelectedList = (item: string) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems((prev) => [...prev, item]);
        }
    };

    const RemoveItemFromSelectedList = (item: string) => {
        const newList = [];
        for (const selectedItem of selectedItems) {
            if (selectedItem !== item) newList.push(selectedItem);
        }

        setSelectedItems(newList);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (initialSelectedItems?.length) {
            for (const val of initialSelectedItems) {
                if (options.includes(val)) {
                    AddItemToSelectedList(val);
                }
            }
        }
    }, [initialSelectedItems]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (focusedListItemIndex > visibleList?.length - 1) {
            setFocusedListItemIndex(Math.max(0, visibleList.length - 1));
        }
    }, [visibleList]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const listItem = document.querySelector(`#multiselect-option-item-${focusedListItemIndex}-${inputId}`) as HTMLElement;
        if (listItem && listScrollContainer.current && !isElementVisible(listItem, listScrollContainer.current)) {
            listItem.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
    }, [focusedListItemIndex]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (setSelectedValues) setSelectedValues(selectedItems);
    }, [selectedItems]);

    return (
        <div className="w-full flex flex-col">
            {selectedItems.length > 0 && (
                <div className="w-full flex gap-x-2 gap-y-1.5 mb-2 flex-wrap">
                    {selectedItems.slice(0, Math.min(3, selectedItems.length)).map((item) => {
                        return (
                            <div
                                key={item}
                                className="flex items-center justify-center gap-1 px-2 rounded-full text-sm border-2 border-accent-background"
                            >
                                <span className="font-semibold">{CapitalizeAndFormatString(item)}</span>
                                <XIcon
                                    className="w-btn-icon h-btn-icon rounded cursor-pointer"
                                    onClick={() => {
                                        RemoveItemFromSelectedList(item);
                                    }}
                                />
                            </div>
                        );
                    })}
                    {selectedItems.length > 3 && <span className="text-muted-foreground italic">and {selectedItems.length - 3} more</span>}
                </div>
            )}

            <div
                className="w-full flex flex-col relative multi-select-input-container"
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.code === "ArrowDown") {
                        changeFocusedItem(1);
                    } else if (e.code === "ArrowUp") {
                        changeFocusedItem(-1);
                    } else if (e.code === "Enter") {
                        const currentFocusedItem = visibleList[focusedListItemIndex];
                        currentFocusedItem && AddItemToSelectedList(currentFocusedItem);
                    }
                }}
            >
                <div className="w-full flex items-center justify-center border border-transparent focus-within:border-shallower-background rounded focus-within:rounded-bl-none focus-within:rounded-br-none">
                    <Input
                        placeholder={inputPlaceholder}
                        id={inputId}
                        name={inputName}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                        }}
                        className="multi-select-input no_focus_ring focus:rounded-bl-none focus:rounded-br-none focus:!bg-transparent"
                    />
                </div>

                <label
                    htmlFor={inputId}
                    className="z-10 multi-select-options-list w-full flex-col hidden absolute top-[100%] py-2 overflow-hidden rounded rounded-tl-none rounded-tr-none bg-card-background border border-shallower-background"
                >
                    <div className="w-ful max-h-[18rem] overflow-auto" ref={listScrollContainer}>
                        {visibleList.map((item, index) => {
                            return (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                <p
                                    key={item}
                                    className={cn(
                                        "w-full text-sm flex items-center justify-start px-4 py-2 text-muted-foreground font-semibold",
                                        index === focusedListItemIndex && "bg-shallow-background text-foreground",
                                    )}
                                    id={`multiselect-option-item-${index}-${inputId}`}
                                    onMouseEnter={() => {
                                        setFocusedListItemIndex(index);
                                    }}
                                    onClick={() => {
                                        const currentFocusedItem = visibleList[focusedListItemIndex];
                                        currentFocusedItem && AddItemToSelectedList(currentFocusedItem);
                                    }}
                                >
                                    {CapitalizeAndFormatString(item)}
                                </p>
                            );
                        })}

                        {!visibleList?.length && (
                            <div className="w-full flex items-center justify-center py-2">
                                <span className="text-muted-foreground italic">No results</span>
                            </div>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
}

const isElementVisible = (element: HTMLElement, container: HTMLDivElement) => {
    const eleTop = element.offsetTop;
    const eleBottom = eleTop + element.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    return eleTop > containerTop && eleBottom < containerBottom;
};

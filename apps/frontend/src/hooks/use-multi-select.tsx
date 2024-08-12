import { useEffect, useState } from "react";

type Props = {
    options: string[];
};

const useMultiSelect = ({ options }: Props) => {
    const [visibleList, setVisibleList] = useState(options);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        if (!searchTerm && selectedItems.length === 0) setVisibleList(options);

        const listWithoutSelectedItems = selectedItems.length > 0 ? [] : options;
        if (selectedItems.length > 0) {
            for (const option of options) {
                if (!selectedItems.includes(option)) {
                    listWithoutSelectedItems.push(option);
                }
            }
        }

        if (searchTerm) {
            const matchingOptions = [];
            for (const option of listWithoutSelectedItems) {
                if (option.toLowerCase().includes(searchTerm.toLowerCase())) {
                    matchingOptions.push(option);
                }
            }

            setVisibleList(matchingOptions);
        } else {
            setVisibleList(listWithoutSelectedItems);
        }
    }, [searchTerm, selectedItems, options]);

    return {
        visibleList,
        setVisibleList,
        searchTerm,
        setSearchTerm,
        selectedItems,
        setSelectedItems,
    };
};

export default useMultiSelect;

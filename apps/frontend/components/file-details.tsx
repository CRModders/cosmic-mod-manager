import { FileIcon } from "@radix-ui/react-icons";
import { parseFileSize } from "@root/lib/utils";

type Props = {
    file_name: string;
    file_size: number;
    is_primary?: boolean;
    children?: React.ReactNode;
};

export default function FileDetails({ file_name, file_size, is_primary, children }: Props) {
    return (
        <div className="w-full flex items-center justify-between py-3 px-6 flex-wrap gap-x-4 gap-y-1 rounded-lg bg-background-shallow text-base font-[500]">
            <div className="flex flex-wrap gap-x-2 gap-y-1 items-center justify-center text-foreground-muted">
                <FileIcon className="w-[1.1rem] h-[1.1rem]" />
                <span className="font-semibold mr-1 text-foreground/90">{file_name}</span>
                <span>({parseFileSize(file_size)})</span>
                {is_primary && <p className="italic">Primary</p>}
            </div>

            {children}
        </div>
    );
}

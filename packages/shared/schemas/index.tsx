import { toast } from "sonner";
import type { ParseParams, z } from "zod";

export const parseValueToSchema = <T extends z.Schema>(schema: T, data: unknown, params?: Partial<ParseParams>) => {
    try {
        const parsedData = schema.parse(data, params) as z.infer<typeof schema>;
        return { data: parsedData, error: null };
    } catch (error) {
        // @ts-ignore
        const errorMsg = error?.issues?.[0]?.message;
        // @ts-ignore
        const errorPath = error?.issues?.[0]?.path?.[0];
        return { data: null, error: errorMsg && errorPath ? `${errorPath}: ${errorMsg}` : error };
    }
};

export const checkFormValidity = async (callback: () => void | Promise<void>) => {
    try {
        await callback();
        return true;
    } catch (error) {
        // @ts-ignore
        const name = error?.issues?.[0]?.path?.[0];
        // @ts-ignore
        const errMsg = error?.issues?.[0]?.message;
        const message =
            name && errMsg ? (
                <div className="w-full flex flex-col items-start justify-start text-danger-foreground">
                    <span>
                        Error in <em className="not-italic font-medium">{name}</em>
                    </span>
                    <span className="text-sm text-muted-foreground">{errMsg}</span>
                </div>
            ) : (
                `Form error: ${error}`
            );

        toast.error(name ? message : "Error", { description: errMsg });
        return false;
    }
};

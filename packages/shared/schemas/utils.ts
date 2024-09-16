import { toast } from "sonner";
import type { ParseParams, z } from "zod";

export const parseValueToSchema = async <T extends z.Schema>(schema: T, data: unknown, params?: Partial<ParseParams>) => {
    try {
        const parsedData = (await schema.parseAsync(data, params)) as z.infer<typeof schema>;
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
        const errorTitle = name && errMsg ? `Error in "${name}"` : `Form error: ${error}`;
        const errorDescription = name && errMsg ? errMsg : "";

        toast.error(errorTitle, { description: errorDescription });
        return false;
    }
};

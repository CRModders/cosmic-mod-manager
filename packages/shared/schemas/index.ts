import type { ParseParams, z } from "zod";

export const parseValueToSchema = <T extends z.Schema>(schema: T, data: unknown, params?: Partial<ParseParams>) => {
    try {
        const parsedData = schema.parse(data, params) as z.infer<typeof schema>;
        return { data: parsedData, error: null };
    } catch (error) {
        // @ts-ignore
        return { data: null, error: error?.issues?.[0]?.message || error };
    }
};

import { reactQueryClient } from "@/src/providers";
import type { EnsureQueryDataOptions, UseQueryOptions } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";

export type routeLoaderQueryArg<T> = EnsureQueryDataOptions<T> | ((args: LoaderFunctionArgs) => EnsureQueryDataOptions<T>);

const buildQueryObj = <T>(query: routeLoaderQueryArg<T>, args: LoaderFunctionArgs): EnsureQueryDataOptions<T> => {
    return typeof query === "function" ? query(args) : query;
};

type CustomDataLoaderFunction = (args: LoaderFunctionArgs) => Record<string, unknown> | Promise<Record<string, unknown>>;

export function routeLoader<T>(query: routeLoaderQueryArg<T> | null, customData?: CustomDataLoaderFunction) {
    return async (args: LoaderFunctionArgs) => {
        if (customData) {
            return await customData(args);
        }
        if (!query) throw new Error("No query provided to routeLoader");

        const _query = buildQueryObj(query, args);
        return { data: await ensureQueryData(_query) };
    };
}

type query<T> = UseQueryOptions<T> | (() => UseQueryOptions<T>);

export async function ensureQueryData<T>(query: query<T>) {
    let _query: query<T> | null = null;
    if (typeof query === "function") {
        _query = query();
    } else {
        _query = query;
    }

    return await reactQueryClient.ensureQueryData(_query);
}

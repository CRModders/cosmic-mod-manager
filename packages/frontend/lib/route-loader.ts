import type { EnsureQueryDataOptions, QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs, defer } from "react-router-dom";

export type routeLoaderQueryArg<T> = EnsureQueryDataOptions<T> | ((args: LoaderFunctionArgs) => EnsureQueryDataOptions<T>);

const buildQueryObj = <T>(query: routeLoaderQueryArg<T>, args: LoaderFunctionArgs): EnsureQueryDataOptions<T> => {
    return typeof query === "function" ? query(args) : query;
};

type CustomDataLoaderFunction = (
    queryClient: QueryClient,
    args: LoaderFunctionArgs,
) => Record<string, unknown> | Promise<Record<string, unknown>>;

export function routeLoader<T>(query: routeLoaderQueryArg<T> | null, customData?: CustomDataLoaderFunction) {
    return (queryClient: QueryClient) => {
        return async (args: LoaderFunctionArgs) => {
            if (customData) {
                return defer(await customData(queryClient, args));
            }
            if (!query) throw new Error("No query provided to routeLoader");

            const _query = buildQueryObj(query, args);
            return defer({
                data: await queryClient.ensureQueryData(_query),
            });
        };
    };
}

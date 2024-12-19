import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index(f("home.tsx")), route("*", f("404.tsx"))] satisfies RouteConfig;

function f(route: string) {
    return `routes/${route}`;
}

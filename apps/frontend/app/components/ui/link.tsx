import DefaultLink, {
    ButtonLink as DefaultButtonLink,
    VariantButtonLink as DefaultVariantButtonLink,
    useNavigate as __useNavigate,
} from "@app/components/ui/link";
import React from "react";
import type { NavigateFunction, NavigateOptions } from "react-router";
import { useRouteLoaderData } from "react-router";
import type { RootOutletData } from "~/root";
import { PageUrl } from "~/utils/urls";

export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

interface Props extends Omit<React.ComponentProps<typeof DefaultLink>, "viewTransitions"> {
    escapeUrlWrapper?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, Props>(({ escapeUrlWrapper, ...props }, ref) => {
    const data = useRouteLoaderData<RootOutletData>("root");
    const viewTransitions = data?.viewTransitions;

    let to = props.to;
    if (escapeUrlWrapper !== true) to = PageUrl(to.toString());

    return <DefaultLink viewTransitions={viewTransitions} ref={ref} {...props} to={to} />;
});
export default Link;

type ButtonLinkProps = React.ComponentProps<typeof DefaultButtonLink>;
export function ButtonLink(props: ButtonLinkProps) {
    return <DefaultButtonLink {...props} url={PageUrl(props.url)} />;
}

export const VariantButtonLink = DefaultVariantButtonLink;

export function useNavigate(escapeUrlWrapper?: boolean) {
    const navigate = __useNavigate();

    const __navigate = (to: string, options?: NavigateOptions): void => {
        const toUrl = escapeUrlWrapper === true ? to : PageUrl(to);

        navigate(toUrl, { viewTransition: true, ...options });
    };

    return __navigate as NavigateFunction;
}

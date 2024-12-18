import DefaultLink, {
    ButtonLink as DefaultButtonLink,
    VariantButtonLink as DefaultVariantButtonLink,
    useNavigate as __useNavigate,
} from "@app/components/ui/link";
import React from "react";
import type { NavigateFunction, NavigateOptions } from "react-router";
import { useRootData } from "~/hooks/root-data";
import { PageUrl } from "~/utils/urls";

export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

interface Props extends Omit<React.ComponentProps<typeof DefaultLink>, "viewTransitions"> {
    escapeUrlWrapper?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, Props>(({ escapeUrlWrapper, ...props }, ref) => {
    let to = props.to;
    if (escapeUrlWrapper !== true) to = PageUrl(to.toString());

    return <DefaultLink {...props} viewTransition={true} ref={ref} to={to} />;
});
export default Link;

type ButtonLinkProps = React.ComponentProps<typeof DefaultButtonLink>;
export function ButtonLink(props: ButtonLinkProps) {
    return <DefaultButtonLink {...props} url={PageUrl(props.url)} />;
}

type VariantButtonLinkProps = React.ComponentProps<typeof DefaultVariantButtonLink>;
export function VariantButtonLink(props: VariantButtonLinkProps) {
    const viewTransitions = useRootData()?.viewTransitions;
    return <DefaultVariantButtonLink {...props} url={PageUrl(props.url)} viewTransition={viewTransitions} />;
}

export function useNavigate(escapeUrlWrapper?: boolean, initOptions?: NavigateOptions) {
    const navigate = __useNavigate();

    const __navigate = (to: string, options?: NavigateOptions): void => {
        const toUrl = escapeUrlWrapper === true ? to : PageUrl(to);

        navigate(toUrl, { viewTransition: true, ...initOptions, ...options });
    };

    return __navigate as NavigateFunction;
}

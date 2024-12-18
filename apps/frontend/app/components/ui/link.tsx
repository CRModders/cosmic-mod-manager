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
    const viewTransitions = useRootData()?.viewTransitions;

    let to = props.to;
    if (escapeUrlWrapper !== true) to = PageUrl(to.toString());

    return <DefaultLink {...props} viewTransition={viewTransitions} ref={ref} to={to} />;
});
export default Link;

type ButtonLinkProps = React.ComponentProps<typeof DefaultButtonLink>;
export function ButtonLink(props: ButtonLinkProps) {
    const viewTransitions = useRootData()?.viewTransitions;

    return <DefaultButtonLink {...props} url={PageUrl(props.url)} viewTransition={viewTransitions} />;
}

type VariantButtonLinkProps = React.ComponentProps<typeof DefaultVariantButtonLink>;
export function VariantButtonLink(props: VariantButtonLinkProps) {
    const viewTransitions = useRootData()?.viewTransitions;
    return <DefaultVariantButtonLink {...props} url={PageUrl(props.url)} viewTransition={viewTransitions} />;
}

export function useNavigate(escapeUrlWrapper?: boolean) {
    const navigate = __useNavigate();
    const viewTransitions = useRootData()?.viewTransitions;

    const __navigate = (to: string, options?: NavigateOptions): void => {
        const toUrl = escapeUrlWrapper === true ? to : PageUrl(to);

        navigate(toUrl, { ...options, viewTransition: viewTransitions });
    };

    return __navigate as NavigateFunction;
}

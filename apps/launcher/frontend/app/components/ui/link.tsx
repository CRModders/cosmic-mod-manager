import DefaultLink, {
    ButtonLink as DefaultButtonLink,
    VariantButtonLink as DefaultVariantButtonLink,
    useNavigate as __useNavigate,
} from "@app/components/ui/link";
import React from "react";
import type { NavigateFunction, NavigateOptions } from "react-router";

export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

interface Props extends Omit<React.ComponentProps<typeof DefaultLink>, "viewTransitions"> {}

const Link = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
    return <DefaultLink {...props} viewTransition={false} ref={ref} />;
});
export default Link;

type ButtonLinkProps = React.ComponentProps<typeof DefaultButtonLink>;
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>((props, ref) => {
    return <DefaultButtonLink {...props} viewTransition={false} ref={ref} />;
});

type VariantButtonLinkProps = React.ComponentProps<typeof DefaultVariantButtonLink>;
export function VariantButtonLink(props: VariantButtonLinkProps) {
    return <DefaultVariantButtonLink {...props} viewTransition={false} />;
}

export function useNavigate(initOptions?: NavigateOptions) {
    const navigate = __useNavigate();

    function __navigate(to: string, options?: NavigateOptions): void {
        navigate(to, { viewTransition: true, ...initOptions, ...options });
    }

    return __navigate as NavigateFunction;
}

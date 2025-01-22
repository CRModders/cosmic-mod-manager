import DefaultLink, {
    ButtonLink as DefaultButtonLink,
    VariantButtonLink as DefaultVariantButtonLink,
    useNavigate as __useNavigate,
} from "@app/components/ui/link";
import type React from "react";
import type { NavigateFunction, NavigateOptions } from "react-router";

export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

interface Props extends Omit<React.ComponentProps<typeof DefaultLink>, "viewTransitions"> {}

export default function Link(props: Props) {
    return <DefaultLink {...props} viewTransition={false} />;
}

type ButtonLinkProps = React.ComponentProps<typeof DefaultButtonLink>;
export function ButtonLink(props: ButtonLinkProps) {
    return <DefaultButtonLink {...props} viewTransition={false} />;
}

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

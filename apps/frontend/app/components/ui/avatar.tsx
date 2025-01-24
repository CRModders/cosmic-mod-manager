import { ImgWrapper as DefaultImgWrapper } from "@app/components/ui/avatar";
import type React from "react";
import { useRootData } from "~/hooks/root-data";

type Props = Omit<React.ComponentProps<typeof DefaultImgWrapper>, "viewTransitions">;

export function ImgWrapper(props: Props) {
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;
    return <DefaultImgWrapper {...props} viewTransitions={viewTransitions} />;
}

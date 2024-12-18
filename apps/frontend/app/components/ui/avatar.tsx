import { ImgWrapper as DefaultImgWrapper } from "@app/components/ui/avatar";
import { useRootData } from "~/hooks/root-data";

export function ImgWrapper(props: React.ComponentProps<typeof DefaultImgWrapper>) {
    const data = useRootData();

    return <DefaultImgWrapper {...props} viewTransitions={data.viewTransitions === true} />;
}

import { ListFiles } from "@wails/App";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import usePathSegments from "~/hooks/path-segments";
import HomePage from "~/pages/page";

export default function _HomePage() {
    const files = useLoaderData<typeof clientLoader>();
    const { setSegments } = usePathSegments();

    useEffect(() => {
        setSegments([{ label: "Home", href: "/" }]);
    }, []);

    return <HomePage files={files || []} />;
}

export async function clientLoader() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const files = await ListFiles();
    return files;
}

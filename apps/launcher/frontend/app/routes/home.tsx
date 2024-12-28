import { useEffect } from "react";
import usePathSegments from "~/hooks/path-segments";
import HomePage from "~/pages/page";

export default function _HomePage() {
    const { setSegments } = usePathSegments();

    useEffect(() => {
        setSegments([{ label: "Home", href: "/" }]);
    }, []);

    return <HomePage />;
}

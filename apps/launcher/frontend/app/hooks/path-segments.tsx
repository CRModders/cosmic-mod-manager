import { createContext, use, useState } from "react";

export interface Segment {
    label: string;
    href?: string;
}

export interface PathSegmentsContext {
    segments: Segment[];
    setSegments: (segments: Segment[]) => void;
}

const PathSegmentsContext = createContext<PathSegmentsContext>({
    segments: [{ label: "Home" }],
    setSegments: () => {},
});

interface Props {
    children: React.ReactNode;
}

export function PathSegmentsContextProvider(props: Props) {
    const [pathSegments, setPathSegments] = useState<Segment[]>([{ label: "Home" }]);

    function _setPathSegments(segments: Segment[]) {
        if (segments.length === 0) {
            setPathSegments([{ label: "Home" }]);
            return;
        }

        if (segments.length > 2) {
            segments = segments.slice(0, 2);
        }

        setPathSegments(segments);
    }

    return (
        <PathSegmentsContext
            value={{
                segments: pathSegments,
                setSegments: _setPathSegments,
            }}
        >
            {props.children}
        </PathSegmentsContext>
    );
}

export default function usePathSegments() {
    const ctx = use(PathSegmentsContext);
    if (!ctx) throw new Error("usePathSegments must be used within a PathSegmentsContextProvider");

    return ctx;
}

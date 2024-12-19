import { useEffect, useState } from "react";

interface Props {
    files: string[];
}

interface LocationHistory {
    length: number;
    state: unknown;
}

export default function HomePage(props: Props) {
    const [history, setHistory] = useState<LocationHistory | null>(null);

    useEffect(() => {
        setHistory({ length: window.history.length, state: window.history.state });
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <pre>{JSON.stringify(history, null, 4)}</pre>
            <pre>{JSON.stringify(props.files, null, 4)}</pre>
        </div>
    );
}

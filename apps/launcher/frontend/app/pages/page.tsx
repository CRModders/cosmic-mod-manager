import { ListFiles } from "@wails/App";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [files, setFiles] = useState<string[]>([]);

    async function fetchFiles() {
        setFiles(await ListFiles());
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <pre>{JSON.stringify(files, null, 4)}</pre>
        </div>
    );
}

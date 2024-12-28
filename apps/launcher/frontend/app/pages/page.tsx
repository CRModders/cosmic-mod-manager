import useRootData from "~/hooks/root-data";

export default function HomePage() {
    const ctx = useRootData();

    return (
        <div>
            <h1>Home Page</h1>

            <pre>{JSON.stringify(ctx?.gameVersions, null, 4)}</pre>
        </div>
    );
}

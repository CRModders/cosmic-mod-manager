import { MeiliSearch } from "meilisearch";

let meilisearch: MeiliSearch;

if (process.env.NODE_ENV === "production") {
    meilisearch = new MeiliSearch({
        apiKey: process.env.MEILISEARCH_MASTER_KEY || "",
        host: process.env.MEILISEARCH_API_URL || "http://localhost:7700",
    });
} else {
    if (!global.meilisearch) {
        global.meilisearch = new MeiliSearch({
            apiKey: process.env.MEILISEARCH_MASTER_KEY || "",
            host: process.env.MEILISEARCH_API_URL || "http://localhost:7700",
        });
    }
    meilisearch = global.meilisearch;
}

export default meilisearch;

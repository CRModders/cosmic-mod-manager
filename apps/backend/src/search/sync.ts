import { MeiliSearch } from "meilisearch";
import prisma from "@/lib/prisma";

const syncMeilisearchWithPostgres = async () => {
    const client = new MeiliSearch({
        apiKey: process.env.MEILISEARCH_MASTER_KEY || "",
        host: process.env.MEILISEARCH_API_URL || "http://localhost:7700",
    });

    // An index is where the documents are stored.
    const index = client.index("projects");

    const projects = await prisma.project.findMany({
        where: {},
        select: {
            id: true,
            name: true,
            summary: true,
            tags: true,
            featured_tags: true,
        },
    });

    const response = await index.addDocuments(projects);

    console.log(response);
};

syncMeilisearchWithPostgres();

export default syncMeilisearchWithPostgres;

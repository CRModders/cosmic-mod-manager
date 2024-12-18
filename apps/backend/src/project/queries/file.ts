import type { File as DBFile } from "@prisma/client";
import prisma from "~/services/prisma";

export async function getFilesFromId(fileIds: string[]) {
    const data = await prisma.file.findMany({
        where: {
            id: {
                in: fileIds,
            },
        },
    });

    const map = new Map<string, DBFile>();
    for (const file of data) {
        map.set(file.id, file);
    }

    return map;
}

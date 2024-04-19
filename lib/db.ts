import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL;
const prismaClientSingleton = () => {
	return new PrismaClient({
		datasourceUrl: dbUrl,
	});
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;

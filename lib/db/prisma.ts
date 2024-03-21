import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL;
const prismaClientSingleton = () => {
	return new PrismaClient({
		datasourceUrl: dbUrl,
	});
};

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const createNewClient = () => {
	return prismaClientSingleton();
};

const prisma = globalThis.prismaGlobal ?? createNewClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

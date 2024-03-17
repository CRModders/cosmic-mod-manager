import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_URI as string;
let client: MongoClient;
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
	if (cachedClient) {
		return cachedClient;
	}

	try {
		client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		// connect the client
		await client.connect();

		cachedClient = client;
		return client;
	} catch (error) {
		client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		// connect the client
		await client.connect();

		cachedClient = client;
		return client;
	}
}

process.on("exit", async () => {
	await client.close();
	process.exit();
});

export default connectToDatabase;

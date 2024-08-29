import type { BunFile, SupportedCryptoAlgorithms } from "bun";

export const createHashFromBuffer = async (fileBuffer: ArrayBuffer, algorithm: SupportedCryptoAlgorithms = "sha256") => {
    const hash = Bun.CryptoHasher.hash(algorithm, fileBuffer).toString("hex");
    return hash;
}

export const createHashFromFile = async (file: File | BunFile, algorithm: SupportedCryptoAlgorithms) => {
    const fileBuffer = await file.arrayBuffer();
    return await createHashFromBuffer(fileBuffer, algorithm);
}

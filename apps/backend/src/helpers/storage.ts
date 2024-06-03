const uploadsDir = process.env.UPLOADS_DIR as string;

export const generateUserStorateUrl = (userId: string) => {
	return `project-files/${userId}`;
};

export const generateProjectStorageUrl = (userId: string, projectId: string) => {
	return `${generateUserStorateUrl(userId)}/projects/${projectId}`;
};

export const generateProjectVersionStorageUrl = (userId: string, projectId: string, versionUrlSlug: string) => {
	return `${generateProjectStorageUrl(userId, projectId)}/versions/${versionUrlSlug}`;
};

export const generateProjectVersionFileStorageUrl = (
	userId: string,
	projectId: string,
	versionUrlSlug: string,
	fileName: string,
) => {
	return `${generateProjectVersionStorageUrl(userId, projectId, versionUrlSlug)}/${fileName}`;
};

const storeFile = async (path: string, file: File) => {
	await Bun.write(path, file, {
		createPath: true,
	});
};

export const saveProjectVersionFile = async ({
	fileName,
	userId,
	projectId,
	versionUrlSlug,
	file,
}: {
	fileName: string;
	userId: string;
	projectId: string;
	versionUrlSlug: string;
	file: File;
}) => {
	const fileUrl = generateProjectVersionFileStorageUrl(userId, projectId, versionUrlSlug, fileName);
	const filePath = `${uploadsDir}/${fileUrl}`;

	await storeFile(filePath, file);
	return fileUrl;
};

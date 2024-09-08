const apiKey = process.env.IMGBB_API_KEY;

if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not set");
}

export const uploadImageToImgbb = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", apiKey);

    const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
    });
    const data = (await response.json())?.data;

    if (!response.ok || !data) {
        throw new Error(data.error.message);
    }

    return { path: data.url as string };
};

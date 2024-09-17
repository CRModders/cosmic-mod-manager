const uploadImage = async (filePath: string) => {
    const file = Bun.file(filePath);

    const url = "https://postimages.org/json/rr";
    const formData = new FormData();
    formData.append("gallery", "");
    formData.append("optsize", "0");
    formData.append("expire", "0");
    formData.append("numfiles", "1");
    formData.append("upload_session", `${Date.now()}`);
    formData.append("upload_referer", "");
    formData.append("file", file);

    const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            origin: "https://postimages.org",
            referer: "https://postimages.org/",
            accept: "application/json",
            "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Brave";v="128"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
        },
        body: formData,
    });
    const data = await res.json();

    return data;
};

console.log(await uploadImage("./Genshi impact poster.jpg"));

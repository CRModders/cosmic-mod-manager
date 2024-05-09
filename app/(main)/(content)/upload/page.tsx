"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serverUrl } from "@/config";
import { useState } from "react";

const UploadPage = () => {
	const [file, setFile] = useState<File | null>(null);

	const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0]);
		}
	};

	const uploadFile = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("file", file);

		const result = await fetch(`${serverUrl}/upload/${file.name}`, {
			method: "POST",
			body: formData,
		});
		const msg = await result.json();

		console.log(msg);
	};

	return (
		<div className="w-full flex items-center justify-center">
			<form onSubmit={uploadFile} className="flex flex-col items-center justify-center gap-4">
				<div className="w-full flex flex-col">
					<Label htmlFor="picture">Picture</Label>
					<Input onChange={handleFileInputChange} id="picture" type="file" />
				</div>
				<Button type="submit">Upload</Button>
			</form>
		</div>
	);
};

export default UploadPage;

"use server";

import { revalidatePath } from "next/cache";

export const RevalidatePath = (pahtName = "/", type: "page" | "layout" = "page") => {
	revalidatePath(pahtName, type);
};

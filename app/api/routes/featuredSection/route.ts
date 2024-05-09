import { getFeaturedSectionContent } from "@/app/api/actions/featuredSection";
import { NextResponse } from "next/server";

export const GET = async () => {
	const result = await getFeaturedSectionContent();
	return NextResponse.json(result);
};

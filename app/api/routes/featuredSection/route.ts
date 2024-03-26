import { NextRequest, NextResponse } from "next/server";
import { getFeaturedSectionContent } from "@/app/api/actions/featuredSection";

export const GET = async () => {
	const result = await getFeaturedSectionContent();
	return NextResponse.json(result);
};

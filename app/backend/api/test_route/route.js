import { NextRequest, NextResponse } from "next/server";
/**
 * @param {NextRequest} request
 * @returns {NextResponse}
 */

export const GET = (request) => {
	return NextResponse.json(
		{
			message: "Test api route's response message",
			url: request.nextUrl.url,
		},
		{
			status: 200,
		},
	);
};

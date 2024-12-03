import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { ConfirmationType } from "@shared/types";
import ConfirmActionPage from "~/pages/auth/confirm-action/page";

export default function _ConfirmAction() {
    const { actionType, code } = useLoaderData<typeof loader>();

    return <ConfirmActionPage actionType={actionType} code={code} />;
}

export async function loader(props: LoaderFunctionArgs) {
    let code = null;
    let actionType = null;

    try {
        const url = new URL(props.request.url);
        code = url.searchParams.get("code");

        const res = await serverFetch(props.request, "/api/user/confirmation-action", {
            method: "POST",
            body: JSON.stringify({ code }),
        });
        const data = await resJson<{ actionType: ConfirmationType }>(res);

        actionType = (data?.actionType as ConfirmationType) || null;
    } catch {}

    return Response.json({
        actionType: actionType,
        code: code,
    });
}

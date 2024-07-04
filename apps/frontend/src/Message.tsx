import { Button } from "@/components/ui/button";
import { FormErrorMessage, FormSuccessMessage } from "@/components/ui/form-message";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MessageLinkData = { url: string; label: string };

const MessageLink = ({ url, label }: MessageLinkData) => {
    if (!url || !label) {
        return null;
    }

    return (
        <Link to={url}>
            <Button variant="link" className="text-base">
                {label}
            </Button>
        </Link>
    );
};

const MessagePage = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"neutral" | "success" | "error">("neutral");
    const [LinkData, setLinkData] = useState<MessageLinkData | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setLinkData({
            url: decodeURIComponent(searchParams.get("linkUrl") || ""),
            label: decodeURIComponent(searchParams.get("linkLabel") || ""),
        });

        setMessage(decodeURIComponent(searchParams.get("message") || ""));
        const msgType = searchParams.get("messageType");
        switch (msgType) {
            case "success":
                setMessageType("success");
                break;
            case "error":
                setMessageType("error");
                break;
            default:
                setMessageType("neutral");
                break;
        }
    }, []);

    switch (messageType) {
        case "error":
            return (
                <div className="w-full min-h-[90vh] flex flex-col gap-4 items-center justify-center max-w-lg">
                    <FormErrorMessage text={message} />
                    <MessageLink url={LinkData?.url || ""} label={LinkData?.label || ""} />
                </div>
            );
        case "success":
            return (
                <div className="w-full min-h-[90vh] flex flex-col gap-4 items-center justify-center max-w-lg">
                    <FormSuccessMessage text={message} />
                    <MessageLink url={LinkData?.url || ""} label={LinkData?.label || ""} />
                </div>
            );
        default:
            return (
                <div className="w-full min-h-[90vh] flex flex-col gap-4 items-center justify-center max-w-lg">
                    <p>{message}</p>
                    <MessageLink url={LinkData?.url || ""} label={LinkData?.label || ""} />
                </div>
            );
    }
};

export default MessagePage;

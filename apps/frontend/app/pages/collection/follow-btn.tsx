import { Button } from "@app/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useSession } from "~/hooks/session";
import useCollections from "./provider";

export function FollowProject_Btn(props: { projectId: string }) {
    const session = useSession();
    const ctx = useCollections();

    if (!session?.id) return null;

    const following = ctx.followingProjects.includes(props.projectId);

    return (
        <Button
            variant={"secondary-inverted"}
            className="rounded-full w-11 h-11 p-0"
            aria-label="Follow"
            onClick={() => {
                if (following) {
                    ctx.unfollowProject(props.projectId);
                } else {
                    ctx.followProject(props.projectId);
                }
            }}
        >
            <HeartIcon aria-hidden className="w-btn-icon-lg h-btn-icon-lg" fill={following ? "currentColor" : "none"} />
        </Button>
    );
}

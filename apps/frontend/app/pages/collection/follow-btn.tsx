import { Button } from "@app/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useSession } from "~/hooks/session";
import useCollections from "./provider";
import { useNavigate } from "~/components/ui/link";

export function FollowProject_Btn(props: { projectId: string }) {
    const session = useSession();
    const ctx = useCollections();
    const navigate = useNavigate();
    const isFollowing = ctx.followingProjects.includes(props.projectId);

    async function toggleFollow() {
        // Redirect to login page if the user isn't logged in
        if (!session?.id) return navigate("/login");

        if (isFollowing) {
            ctx.unfollowProject(props.projectId);
        } else {
            ctx.followProject(props.projectId);
        }
    }

    return (
        <Button variant={"secondary-inverted"} className="rounded-full w-11 h-11 p-0" aria-label="Follow" onClick={toggleFollow}>
            <HeartIcon aria-hidden className="w-btn-icon-lg h-btn-icon-lg" fill={isFollowing ? "currentColor" : "none"} />
        </Button>
    );
}

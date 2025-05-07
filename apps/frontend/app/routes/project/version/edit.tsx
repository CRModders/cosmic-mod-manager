import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import EditVersionPage from "~/pages/project/version/edit-version";

export default function () {
    const session = useSession();

    if (!session) return <Redirect to="/login" />;
    return <EditVersionPage />;
}

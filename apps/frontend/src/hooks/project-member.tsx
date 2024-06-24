import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/auth-provider";
import { Projectcontext } from "../providers/project-context";

export const useIsUseAProjectMember = () => {
    const { session } = useContext(AuthContext);
    const [isAProjectMember, setisAProjectMember] = useState<boolean | undefined>(undefined);
    const { projectData } = useContext(Projectcontext);

    useEffect(() => {
        if (session === undefined || projectData === undefined) return;
        if (session === null) setisAProjectMember(false);

        if (projectData?.members) {
            for (const member of projectData.members) {
                if (session?.user_id === member?.user?.id) {
                    return setisAProjectMember(true);
                }
            }

            setisAProjectMember(false);
        }
    }, [session, projectData]);

    return isAProjectMember;
};

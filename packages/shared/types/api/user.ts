import type { GlobalUserRole } from "..";

export interface UserProfileData {
    id: string;
    name: string | null;
    userName: string;
    role: GlobalUserRole;
    avatar: string | null;
    bio: string | null;
    dateJoined: Date;
}

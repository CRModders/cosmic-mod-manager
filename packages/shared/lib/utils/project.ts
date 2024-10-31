export interface PartialTeamMember {
    userId: string;
    isOwner: boolean;
}

export function combineProjectMembers<T extends PartialTeamMember>(teamMembers: T[], orgMembers: T[]) {
    const members = new Map<string, T>();
    for (const member of teamMembers) {
        members.set(member.userId, member);
    }

    for (const member of orgMembers) {
        const alreadyAddedMember = members.get(member.userId);
        if (alreadyAddedMember && member?.isOwner === true) {
            members.set(member.userId, {
                ...alreadyAddedMember,
                isOwner: true,
            });

            continue;
        }

        if (alreadyAddedMember) continue;
        members.set(member.userId, member);
    }

    return members;
}

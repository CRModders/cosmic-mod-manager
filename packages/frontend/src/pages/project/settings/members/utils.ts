import useFetch from "@/src/hooks/fetch";

export const acceptTeamInvite = async (teamId: string) => {
    if (!teamId) return;

    const res = await useFetch(`/api/team/${teamId}/invite`, {
        method: "PATCH",
    });
    const data = await res.json();
    return data;
};

export const leaveTeam = async (teamId: string) => {
    if (!teamId) return;

    const res = await useFetch(`/api/team/${teamId}/leave`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
};

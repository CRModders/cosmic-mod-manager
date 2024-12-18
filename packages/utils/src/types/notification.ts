export enum NotificationTypes {
	TEAM_INVITE = "team_invite",
	ORGANISATION_INVITE = "organisation_invite",
}

export interface TeamInvite {
	type: NotificationTypes.TEAM_INVITE;
	projectId: string;
	teamId: string;
	invitedBy: string;
	role: string;
}

export interface OrganisationInvite {
	type: NotificationTypes.ORGANISATION_INVITE;
	organisationId: string;
	teamId: string;
	invitedBy: string;
	role: string;
}

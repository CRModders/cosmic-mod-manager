import type {
    DependencyType,
    OrganisationPermission,
    ProjectPermission,
    ProjectPublishingStatus,
    ProjectSupport,
    ProjectType,
    ProjectVisibility,
    UserSessionStates,
    VersionReleaseChannel,
} from "../";

export interface SessionListData {
    id: string;
    userId: string;
    dateCreated: Date;
    dateLastActive: Date;
    providerName: string;
    status: UserSessionStates;
    os: string | null;
    browser: string | null;
    city: string | null;
    country: string | null;
    ip: string | null;
    userAgent: string | null;
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    userName: string;
    avatarUrl: string | null;
    role: string;
    isOwner: boolean;
    accepted: boolean;
    permissions: ProjectPermission[];
    organisationPermissions: OrganisationPermission[];
}

export interface Organisation {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    members: TeamMember[];
}

export interface GalleryItem {
    id: string;
    name: string;
    description: string | null;
    image: string;
    featured: boolean;
    dateCreated: Date;
    orderIndex: number;
}

export interface ProjectDetailsData {
    id: string;
    teamId: string;
    orgId: string | null;
    name: string;
    slug: string;
    icon: string | null;
    summary: string;
    description: string | null;
    type: ProjectType[];
    categories: string[];
    featuredCategories: string[];
    licenseId: string | null;
    licenseName: string | null;
    licenseUrl: string | null;
    datePublished: Date;
    dateUpdated: Date;
    status: ProjectPublishingStatus;
    visibility: ProjectVisibility;

    downloads: number;
    followers: number;

    issueTrackerUrl: string | null;
    projectSourceUrl: string | null;
    projectWikiUrl: string | null;
    discordInviteUrl: string | null;

    clientSide: ProjectSupport;
    serverSide: ProjectSupport;
    loaders: string[];
    gameVersions: string[];

    gallery: GalleryItem[];
    members: TeamMember[];
    organisation: Organisation | null;
}

export interface VersionFile {
    id: string;
    isPrimary: boolean;
    name: string;
    url: string;
    size: number;
    type: string;
    sha1_hash: string | null;
    sha512_hash: string | null;
}

export interface VersionAuthor {
    id: string;
    userName: string;
    name: string;
    avatarUrl: string | null;
    role: string;
}

export interface DependencyListData {
    id: string;
    projectId: string;
    versionId: string | null;
    dependencyType: DependencyType;
}

export interface ProjectVersionData {
    id: string;
    title: string;
    versionNumber: string;
    changelog: string | null;
    slug: string;
    datePublished: string;
    featured: boolean;
    downloads: number;
    releaseChannel: VersionReleaseChannel;
    gameVersions: string[];
    loaders: string[];
    files: VersionFile[];
    primaryFile: VersionFile | null;
    author: VersionAuthor;
    dependencies: DependencyListData[];
}

export interface ProjectListItem {
    id: string;
    slug: string;
    name: string;
    summary: string;
    type: string[];
    icon: string | null;
    downloads: number;
    followers: number;
    dateUpdated: Date;
    datePublished: Date;
    status?: ProjectPublishingStatus;
    visibility?: ProjectVisibility;
    clientSide?: ProjectSupport;
    serverSide?: ProjectSupport;
    featuredCategories: string[];
    categories: string[];
    gameVersions: string[];
    loaders: string[];

    author?: string; // The author's username
}

export interface OAuthProfile {
    name?: string | null;
    email: string;
    emailVerified: boolean;
    providerName: string;
    providerAccountId: string;
    authType?: string | null;
    accessToken: string;
    refreshToken?: string | null;
    tokenType?: string | null;
    scope?: string | null;
    avatarImage?: string | null;
}

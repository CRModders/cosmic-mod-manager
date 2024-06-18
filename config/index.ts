export const siteTitle = "Cosmic Reach Mod Manager";

// Route types
export const maxNameLength = 32;
export const maxUsernameLength = 32;

export const minPasswordLength = 8;
export const maxPasswordLength = 64;

export const minProjectNameLength = 3;
export const maxProjectNameLength = 64;
export const maxProjectSummaryLength = 256;

export const maxProjectDescriptionLength = 65256;
export const maxChangelogLength = 65256;
export const maxExternalLinkLength = 256;
export const maxFeaturedProjectTags = 3;
export const maxFileSize = 33554432;  // 32 MiB

export const passwordHashingSaltRounds = 8;
export const addNewPasswordVerificationTokenValidity = 24 * 60 * 60; // A day
export const changePasswordConfirmationTokenValidity = 24 * 60 * 60;
export const deleteAccountVerificationTokenValidity = 24 * 60 * 60;

export const deletedUsernameReservationDuration_ms = 30 * 24 * 60 * 60 * 1000;
export const userSessionValidity = 2592000; // 30 * 24 * 60 * 60; A month

// unsecure cookie until we get ssl
export const secureCookie = true;

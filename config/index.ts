export const siteTitle = "Cosmic Reach Mod Manager";
export const serverUrl = "http://localhost:5500";
export const frontendUrl = "http://localhost:3000";

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
export const maxFileSize = 33554432;  // 32 MiB

export const passwordHashingSaltRounds = 8;
export const addNewPasswordVerificationTokenValidity = 24 * 60 * 60; // A day
export const changePasswordConfirmationTokenValidity = 24 * 60 * 60;
export const deleteAccountVerificationTokenValidity = 24 * 60 * 60;

export const deletedUsernameReservationDuration_ms = 30 * 24 * 60 * 60 * 1000;
export const userSessionValidity = 2592000; // 30 * 24 * 60 * 60; A month

// unsecure cookie until we get ssl
export const secureCookie = false;

export const GameVersions = [
    '0.1.36', '0.1.35', '0.1.34', '0.1.33', '0.1.32', '0.1.31', '0.1.30', '0.1.29', '0.1.28', '0.1.27', '0.1.26', '0.1.25', '0.1.24', '0.1.23', '0.1.22', '0.1.21', '0.1.20', '0.1.19', '0.1.18', '0.1.17', '0.1.16', '0.1.15', '0.1.14', '0.1.13', '0.1.12', '0.1.11', '0.1.10', '0.1.9', '0.1.8', '0.1.7', '0.1.6', '0.1.5', '0.1.4', '0.1.3', '0.1.2', '0.1.1'
]

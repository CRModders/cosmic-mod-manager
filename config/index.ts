export const siteTitle = "Cosmic Reach Mod Manager";
export const serverUrl = "http://localhost:5500";
export const frontendUrl = "http://localhost:3000";

// Route types
export const maxNameLength = 32;
export const maxUsernameLength = 32;

export const minPasswordLength = 8;
export const maxPasswordLength = 64;

export const passwordHashingSaltRounds = 8;
export const addNewPasswordVerificationTokenValidity = 24 * 60 * 60; // A day
export const changePasswordConfirmationTokenValidity = 24 * 60 * 60;
export const deleteAccountVerificationTokenValidity = 24 * 60 * 60;

export const deletedUsernameReservationDuration_ms = 30 * 24 * 60 * 60 * 1000;
export const userSessionValidity = 2592000; // 30 * 24 * 60 * 60; A month


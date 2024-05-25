export const siteTitle = "Cosmic Reach Mod Manager";
export const serverUrl = "http://localhost:5500";
export const frontendUrl = "http://localhost:3000";

// Route types
export const maxNameLength = 32;
export const maxUsernameLength = 32;

export const minPasswordLength = 8;
export const maxPasswordLength = 64;

export const passwordHashingSaltRounds = 8;
export const addNewPasswordVerificationTokenValidity_ms = 60 * 60 * 1000; // 60 mins
export const changePasswordConfirmationTokenValidity_ms = 60 * 60 * 1000;
export const deleteAccountVerificationTokenValidity_ms = 60 * 60 * 1000;

export const deletedUsernameReservationDuration_ms = 30 * 24 * 60 * 60 * 1000;
export const userSessionValidity_ms = 30 * 24 * 60 * 60 * 1000;
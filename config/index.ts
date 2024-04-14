//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

export const siteTitle = "Cosmic Reach Mod Manager";

// Route types
export const authRouteApiPrefix = "/api/auth";
export const authRoutes = ["/login", "/register"];
export const protectedRoutes = ["/dashboard", "/settings"];

export const defaultLoginRedirect = "/dashboard";

export const dbSessionTokenCookieKeyName = "authjs.db-session-token";

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

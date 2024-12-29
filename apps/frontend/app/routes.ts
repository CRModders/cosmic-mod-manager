import type { RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import { formatLocaleCode } from "./../app/locales";
import SupportedLocales from "./../app/locales/meta";

const ProjectTypes = ["project", "mod", "modpack", "shader", "resource-pack", "datamod", "plugin"];
const langs = SupportedLocales.map((locale) => formatLocaleCode(locale));

export default remixRoutesOptionAdapter((defineRoutes) => {
    return defineRoutes((route) => {
        for (const lang of ["", ...langs]) {
            route(`/${lang}`, path("root-wrapper.tsx"), { id: `${lang}__root-wrapper` }, () => {
                route("", path("page.tsx"), { id: `${lang}__home-page`, index: true });
                route("about", path("about.tsx"), { id: `${lang}__about-page` });
                route("status", path("status.tsx"), { id: `${lang}__status-page` });

                // Auth routes
                route("login", path("auth/login.tsx"), { id: `${lang}__login-page` });
                route("signup", path("auth/signup.tsx"), { id: `${lang}__signup-page` });
                route("change-password", path("auth/change-password.tsx"), { id: `${lang}__change-password-page` });
                route("auth/revoke-session", path("auth/revoke-session.tsx"), { id: `${lang}__revoke-session-page` });
                route("auth/confirm-action", path("auth/confirm-action.tsx"), { id: `${lang}__confirm-action-page` });
                route("auth/callback/:authProvider", path("auth/auth-callback.tsx"), { id: `${lang}__auth-callback-page` });

                // User Settings
                route("settings", path("settings/layout.tsx"), { id: `${lang}__settings-layout` }, () => {
                    route("", path("settings/prefs.tsx"), { index: true, id: `${lang}__prefs` });
                    route("profile", path("settings/profile.tsx"), { id: `${lang}__profile-settings` });
                    route("account", path("settings/account.tsx"), { id: `${lang}__account-settings` });
                    route("sessions", path("settings/sessions.tsx"), { id: `${lang}__sessions-settings` });
                });

                // Dashboard
                route("dashboard", path("dashboard/layout.tsx"), { id: `${lang}__dashboard-layout` }, () => {
                    route("", path("dashboard/overview.tsx"), { index: true, id: `${lang}__overview` });
                    route("notifications", path("dashboard/notifications/page.tsx"), { id: `${lang}__notifications` });
                    route("notifications/history", path("dashboard/notifications/history.tsx"), { id: `${lang}__notifications-history` });

                    route("projects", path("dashboard/projects.tsx"), { id: `${lang}__dashboard-projects` });
                    route("organizations", path("dashboard/organizations.tsx"), { id: `${lang}__dashboard-organizations` });
                    route("*", path("$.tsx"), { id: `${lang}__dashboard-not-found` });
                });

                // Search pages
                route("", path("search/layout.tsx"), { id: `${lang}__search-layout` }, () => {
                    for (const type of ProjectTypes) {
                        route(`${type}s`, path("search/page.tsx"), { id: `${lang}__${type}s-search` });
                    }
                });

                for (const type of ProjectTypes) {
                    // Project pages
                    route(`${type}/:projectSlug`, path("project/data-wrapper.tsx"), { id: `${lang}__${type}__data-wrapper` }, () => {
                        route("", path("project/layout.tsx"), { id: `${lang}__${type}__layout` }, () => {
                            route("", path("project/page.tsx"), { index: true, id: `${lang}__${type}__page` });
                            route("gallery", path("project/gallery.tsx"), { id: `${lang}__${type}__gallery` });
                            route("changelog", path("project/changelog.tsx"), { id: `${lang}__${type}__changelog` });
                            route("versions", path("project/versions.tsx"), { id: `${lang}__${type}__versions` });
                            route("version", path("project/versions.tsx"), { id: `${lang}__${type}__versions_alternate` });
                            route("version/:versionSlug", path("project/version/page.tsx"), { id: `${lang}__${type}__version__page` });
                            route("version/new", path("project/version/new.tsx"), { id: `${lang}__${type}__version__new` });
                            route("version/:versionSlug/edit", path("project/version/edit.tsx"), { id: `${lang}__${type}__version__edit` });
                        });
                        route("settings", path("project/settings/layout.tsx"), { id: `${lang}__${type}__settings-layout` }, () => {
                            route("", path("project/settings/general.tsx"), { id: `${lang}__${type}__settings__general`, index: true });
                            route("tags", path("project/settings/tags.tsx"), { id: `${lang}__${type}__settings__tags` });
                            route("description", path("project/settings/description.tsx"), {
                                id: `${lang}__${type}__settings__description`,
                            });
                            route("license", path("project/settings/license.tsx"), { id: `${lang}__${type}__settings__license` });
                            route("links", path("project/settings/links.tsx"), { id: `${lang}__${type}__settings__links` });
                            route("members", path("project/settings/members.tsx"), { id: `${lang}__${type}__settings__members` });
                            route("*", path("$.tsx"), { id: `${lang}__${type}__settings-not-found` });
                        });
                    });
                }

                // Organization pages
                route("organization/:orgSlug", path("organization/data-wrapper.tsx"), { id: `${lang}__organization-data-wrapper` }, () => {
                    route("settings", path("organization/settings/layout.tsx"), { id: `${lang}__org-settings` }, () => {
                        route("", path("organization/settings/page.tsx"), { index: true, id: `${lang}__org-general-settings` });
                        route("projects", path("organization/settings/projects.tsx"), { id: `${lang}__org-projects-settings` });
                        route("members", path("organization/settings/members.tsx"), { id: `${lang}__org-members-settings` });
                        route("*", path("$.tsx"), { id: `${lang}__org-settings-not-found` });
                    });

                    route("", path("organization/layout.tsx"), { id: `${lang}__organization__layout` }, () => {
                        route("", path("organization/page.tsx"), { index: true, id: `${lang}__organization__projects-all` });
                        route(":projectType", path("organization/page.tsx"), { id: `${lang}__organization__projects` });
                    });
                });

                // User profile
                route("user/:userName", path("user/layout.tsx"), { id: `${lang}__user-profile` }, () => {
                    route("", path("user/page.tsx"), { index: true, id: `${lang}__user__all-projects` });
                    route(":type", path("user/page.tsx"), { id: `${lang}__user__projects` });
                });

                route("legal", path("legal/layout.tsx"), { id: `${lang}__legal-pages` }, () => {
                    route("", path("legal/terms.tsx"), { id: `${lang}__legal__index-page`, index: true });
                    route("terms", path("legal/terms.tsx"), { index: true, id: `${lang}__terms` });
                    route("rules", path("legal/rules.tsx"), { id: `${lang}__content-rules` });
                    route("copyright", path("legal/copyright.tsx"), { id: `${lang}__copyright-policy` });
                    route("security", path("legal/security.tsx"), { id: `${lang}__security-notice` });
                    route("privacy", path("legal/privacy.tsx"), { id: `${lang}__privacy-policy` });
                });
            });
        }

        // Sitemap
        route("/:sitemap.xml", path("sitemap.tsx"), { id: "sitemaps" });

        // Not found
        route("*", path("$.tsx"), { id: "global__not-found" });
    });
}) satisfies RouteConfig;

function path(pathname: string, prefix = "routes") {
    return `${prefix}/${pathname}`;
}

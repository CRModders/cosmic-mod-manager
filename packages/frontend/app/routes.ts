import type { RouteConfig } from "@remix-run/route-config";
import { remixRoutesOptionAdapter } from "@remix-run/routes-option-adapter";

const ProjectTypes = ["project", "mod", "modpack", "shader", "resource-pack", "datamod", "plugin"];

export default remixRoutesOptionAdapter((defineRoutes) => {
    return defineRoutes((route) => {
        route("/", path("root-wrapper.tsx"), { id: "root-wrapper" }, () => {
            route("", path("page.tsx"), { id: "home-page", index: true });
            route("about", path("about.tsx"));
            route("status", path("status.tsx"));

            // Auth routes
            route("login", path("auth/login.tsx"));
            route("signup", path("auth/signup.tsx"));
            route("change-password", path("auth/change-password.tsx"));
            route("auth/revoke-session", path("auth/revoke-session.tsx"));
            route("auth/confirm-action", path("auth/confirm-action.tsx"));
            route("auth/callback/:authProvider", path("auth/auth-callback.tsx"));

            // User Settings
            route("settings", path("settings/layout.tsx"), () => {
                route("", path("settings/prefs.tsx"), { index: true });
                route("profile", path("settings/profile.tsx"));
                route("account", path("settings/account.tsx"));
                route("sessions", path("settings/sessions.tsx"));
            });

            // Dashboard
            route("dashboard", path("dashboard/layout.tsx"), () => {
                route("", path("dashboard/overview.tsx"), { index: true });
                route("notifications", path("dashboard/notifications/page.tsx"));
                route("notifications/history", path("dashboard/notifications/history.tsx"));

                route("projects", path("dashboard/projects.tsx"));
                route("organizations", path("dashboard/organizations.tsx"));
                route("*", path("$.tsx"));
            });

            // Search pages
            route("", path("search/layout.tsx"), () => {
                for (const type of ProjectTypes) {
                    route(`${type}s`, path("search/page.tsx"), { id: `${type}s` });
                }
            });

            for (const type of ProjectTypes) {
                // Project pages

                route(`${type}/:projectSlug`, path("project/data-wrapper.tsx"), { id: `${type}__data-wrapper` }, () => {
                    route("", path("project/layout.tsx"), { id: `${type}__layout` }, () => {
                        route("", path("project/page.tsx"), { index: true, id: `${type}__page` });
                        route("gallery", path("project/gallery.tsx"), { id: `${type}__gallery` });
                        route("changelog", path("project/changelog.tsx"), { id: `${type}__changelog` });
                        route("versions", path("project/versions.tsx"), { id: `${type}__versions` });
                        route("version/:versionSlug", path("project/version/page.tsx"), { id: `${type}__version__page` });
                        route("version/new", path("project/version/new.tsx"), { id: `${type}__version__new` });
                        route("version/:versionSlug/edit", path("project/version/edit.tsx"), { id: `${type}__version__edit` });
                    });
                    route("settings", path("project/settings/layout.tsx"), { id: `${type}__settings-layout` }, () => {
                        route("", path("project/settings/general.tsx"), { id: `${type}__settings__general`, index: true });
                        route("tags", path("project/settings/tags.tsx"), { id: `${type}__settings__tags` });
                        route("description", path("project/settings/description.tsx"), { id: `${type}__settings__description` });
                        route("license", path("project/settings/license.tsx"), { id: `${type}__settings__license` });
                        route("links", path("project/settings/links.tsx"), { id: `${type}__settings__links` });
                        route("members", path("project/settings/members.tsx"), { id: `${type}__settings__members` });
                        route("*", path("$.tsx"), { id: `${type}__settings-not-found` });
                    });
                });
            }

            // Organization pages
            route("organization/:orgSlug", path("organization/data-wrapper.tsx"), () => {
                route("settings", path("organization/settings/layout.tsx"), () => {
                    route("", path("organization/settings/page.tsx"), { index: true });
                    route("projects", path("organization/settings/projects.tsx"));
                    route("members", path("organization/settings/members.tsx"));
                });

                route("", path("organization/layout.tsx"), { id: "organization__layout" }, () => {
                    route("", path("organization/page.tsx"), { index: true, id: "organization__projects-all" });
                    route(":projectType", path("organization/page.tsx"), { id: "organization__projects" });
                });
            });

            // User profile
            route("user/:userName", path("user/layout.tsx"), () => {
                route("", path("user/page.tsx"), { index: true, id: "user__all-projects" });
                route(":type", path("user/page.tsx"), { id: "user__projects" });
            });

            route("legal", path("legal/layout.tsx"), () => {
                route("", path("legal/terms.tsx"), { id: "legal__index-page", index: true });
                route("terms", path("legal/terms.tsx"), { index: true });
                route("rules", path("legal/rules.tsx"));
                route("copyright", path("legal/copyright.tsx"));
                route("security", path("legal/security.tsx"));
                route("privacy", path("legal/privacy.tsx"));
            });
        });

        // Sitemap
        route("/:sitemap.xml", path("sitemap.tsx"), { id: "sitemaps" });

        // Not found
        route("*", path("$.tsx"), { id: "global__not-found" });
    });
}) satisfies RouteConfig;

function path(pathname: string, prefix = "routes") {
    return `${prefix}/${pathname}`;
}

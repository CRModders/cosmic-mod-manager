import { SuspenseFallback } from "@/components/ui/spinner";
import "@/src/globals.css";
import { projectTypes } from "@shared/config/project";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { projectPageLoader, sessionDataLoader, userProfilePageLoader } from "./contexts/_loaders";
import ErrorView from "./pages/error-page";
import { RootLayout } from "./pages/layout";
import { ContextProviders } from "./providers";

// Home page Loader
import { homePageLoader } from "./pages/_loader";

// Dashboard page Loaders
import dashboardOrgsLoader from "@/src/pages/dashboard/organisation/loader";
import { overviewPageLoader } from "./pages/dashboard/_loader";
import userProjectsLoader from "./pages/dashboard/projects/loader";

import { searchResultsLoader } from "./pages/search/_loader";
// Project settings Loaders
import { accountSettingsPageLoader, userSessionsPageLoader } from "./pages/settings/_loaders";

const projectPageRoutes = () => {
    return ["project", ...projectTypes].map((type) => ({
        path: `${type}/:slug`,
        loader: projectPageLoader,
        lazy: () => import("@/src/pages/project/wrapper-context"),
        children: [
            {
                path: "",
                lazy: () => import("@/src/pages/project/layout"),
                children: [
                    {
                        path: "",
                        lazy: () => import("@/src/pages/project/page"),
                    },
                    {
                        path: "gallery",
                        lazy: () => import("@/src/pages/project/gallery/page"),
                    },
                    {
                        path: "changelog",
                        lazy: () => import("@/src/pages/project/changelog"),
                    },
                    {
                        path: "versions",
                        lazy: () => import("@/src/pages/project/versions/page"),
                    },
                    {
                        path: "version",
                        element: <Outlet />,
                        children: [
                            {
                                path: "new",
                                lazy: () => import("@/src/pages/project/versions/version/new-version"),
                            },
                            {
                                path: ":versionSlug",
                                element: <Outlet />,
                                children: [
                                    {
                                        path: "",
                                        lazy: () => import("@/src/pages/project/versions/version/page"),
                                    },
                                    {
                                        path: "edit",
                                        lazy: () => import("@/src/pages/project/versions/version/edit-version"),
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                path: "settings",
                lazy: () => import("@/src/pages/project/settings/layout"),
                children: [
                    {
                        path: "",
                        lazy: () => import("@/src/pages/project/settings/page"),
                    },
                    {
                        path: "description",
                        lazy: () => import("@/src/pages/project/settings/description"),
                    },
                    {
                        path: "tags",
                        lazy: () => import("@/src/pages/project/settings/tags"),
                    },
                    {
                        path: "links",
                        lazy: () => import("@/src/pages/project/settings/links"),
                    },
                    {
                        path: "license",
                        lazy: () => import("@/src/pages/project/settings/license"),
                    },
                    {
                        path: "members",
                        lazy: () => import("@/src/pages/project/settings/members/page"),
                    },
                    {
                        path: "*",
                        lazy: () => import("@/src/pages/not-found"),
                    },
                ],
            },
            {
                path: "*",
                lazy: () => import("@/src/pages/not-found"),
            },
        ],
    }));
};

const searchPageRoutes = () => {
    return projectTypes.map((type) => ({
        path: `${type}s`,
        loader: searchResultsLoader(type),
        lazy: async () => {
            const mod = await import("@/src/pages/search/layout");
            return {
                element: <mod.Component type={type} />,
            };
        },
    }));
};

const router = createBrowserRouter([
    {
        path: "",
        element: <ContextProviders />,
        loader: sessionDataLoader,
        errorElement: <ErrorView />,
        children: [
            {
                path: "auth/callback/:authProvider",
                lazy: () => import("@/src/pages/auth/callback/page"),
            },
            {
                path: "auth/revoke-session",
                lazy: () => import("@/src/pages/auth/revoke-session"),
            },
            {
                path: "auth/confirm-action",
                lazy: () => import("@/src/pages/auth/confirm-action/page"),
            },
            {
                path: "",
                element: <RootLayout />,
                children: [
                    {
                        path: "",
                        loader: homePageLoader,
                        lazy: () => import("@/src/pages/page"),
                    },
                    {
                        path: "login",
                        lazy: () => import("@/src/pages/auth/login/page"),
                    },
                    {
                        path: "signup",
                        lazy: () => import("@/src/pages/auth/register/page"),
                    },
                    {
                        path: "change-password",
                        lazy: () => import("@/src/pages/auth/change-password/page"),
                    },
                    ...searchPageRoutes(),
                    {
                        path: "user/:userName",
                        loader: userProfilePageLoader,
                        lazy: () => import("@/src/pages/user/layout-wrapper"),
                        children: [
                            {
                                path: "",
                                lazy: () => import("@/src/pages/user/layout"),
                            },
                            {
                                path: ":projectType",
                                lazy: () => import("@/src/pages/user/layout"),
                            },
                        ],
                    },
                    {
                        path: "settings",
                        lazy: () => import("@/src/pages/settings/layout"),
                        children: [
                            {
                                path: "",
                                lazy: () => import("@/src/pages/settings/page"),
                            },
                            {
                                path: "account",
                                loader: accountSettingsPageLoader,
                                lazy: () => import("@/src/pages/settings/account/page"),
                            },
                            {
                                path: "sessions",
                                loader: userSessionsPageLoader,
                                lazy: () => import("@/src/pages/settings/sessions/page"),
                            },
                        ],
                    },
                    {
                        path: "dashboard",
                        // Loading overview data and notifications on dashboard load
                        loader: overviewPageLoader,
                        lazy: () => import("@/src/pages/dashboard/layout"),
                        children: [
                            {
                                path: "",
                                lazy: () => import("@/src/pages/dashboard/overview"),
                            },
                            {
                                path: "notifications",
                                lazy: () => import("@/src/pages/dashboard/notifications/layout"),
                                children: [
                                    {
                                        path: "",
                                        lazy: () => import("@/src/pages/dashboard/notifications/page"),
                                    },
                                    {
                                        path: "history",
                                        lazy: () => import("@/src/pages/dashboard/notifications/history"),
                                    },
                                ],
                            },
                            {
                                path: "projects",
                                loader: userProjectsLoader,
                                lazy: () => import("@/src/pages/dashboard/projects/page"),
                            },
                            {
                                path: "organisations",
                                loader: dashboardOrgsLoader,
                                lazy: () => import("@/src/pages/dashboard/organisation/page"),
                            },
                            {
                                path: "*",
                                lazy: () => import("@/src/pages/not-found"),
                            },
                        ],
                    },
                    ...projectPageRoutes(),
                    {
                        path: "*",
                        lazy: () => import("@/src/pages/not-found"),
                    },
                ],
            },
        ],
    },
]);

const rootEl = document.getElementById("root");
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        // <StrictMode>
        <RouterProvider router={router} fallbackElement={<SuspenseFallback className="py-32" />} />,
        // </StrictMode>,
    );
}

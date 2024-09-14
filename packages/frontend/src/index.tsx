import { SuspenseFallback } from "@/components/ui/spinner";
import "@/src/globals.css";
import RootLayout from "@/src/pages/layout";
import SettingsPageLayout from "@/src/pages/settings/layout";
import { projectTypes } from "@shared/config/project";
import { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import ProjectContextProvider from "./contexts/curr-project";
import { UserProfileContextProvider } from "./contexts/user-profile";
import { RedirectIfLoggedIn, RedirectIfNotLoggedIn } from "./pages/auth/guards";
import DashboardLayout from "./pages/dashboard/layout";
import ErrorView from "./pages/error-page";
import NotFoundPage from "./pages/not-found";
import ProjectPageLayout from "./pages/project/layout";
import ContextProviders from "./providers";

const HomePage = lazy(() => import("@/src/pages/page"));
const LoginPage = lazy(() => import("@/src/pages/auth/login/page"));
const SignUpPage = lazy(() => import("@/src/pages/auth/register/page"));
const OAuthCallbackPage = lazy(() => import("@/src/pages/auth/callback/page"));
const SettingsPage = lazy(() => import("@/src/pages/settings/page"));
const AccountSettingsPage = lazy(() => import("@/src/pages/settings/account/page"));
const SessionsPage = lazy(() => import("@/src/pages/settings/sessions/page"));
const ConfirmActionPage = lazy(() => import("@/src/pages/auth/confirm-action/page"));
const ChangePasswordPage = lazy(() => import("@/src/pages/auth/change-password/page"));
const RevokeSessionPage = lazy(() => import("@/src/pages/auth/revoke-session"));

// Dashboard
const OverviewPage = lazy(() => import("@/src/pages/dashboard/overview"));
const ProjectsPage = lazy(() => import("@/src/pages/dashboard/projects/page"));

// Project details
const ProjectPage = lazy(() => import("@/src/pages/project/page"));
const ProjectGallery = lazy(() => import("@/src/pages/project/gallery/page"));
const ProjectVersionsPage = lazy(() => import("@/src/pages/project/versions/page"));
const VersionChangelogs = lazy(() => import("@/src/pages/project/changelog"));
const VersionPage = lazy(() => import("@/src/pages/project/versions/version/page"));
const UploadVersionPage = lazy(() => import("@/src/pages/project/versions/version/new-version"));
const EditVersionPage = lazy(() => import("@/src/pages/project/versions/version/edit-version"));

// Project settings
const ProjectSettingsLayout = lazy(() => import("@/src/pages/project/settings/layout"));
const GeneralSettingsPage = lazy(() => import("@/src/pages/project/settings/page"));
const DescriptionSettings = lazy(() => import("@/src/pages/project/settings/description"));
const TagsSettingsPage = lazy(() => import("@/src/pages/project/settings/tags"));
const ExternalLinksSettingsPage = lazy(() => import("@/src/pages/project/settings/links"));
const LicenseSettingsPage = lazy(() => import("./pages/project/settings/license"));
const ProjectMemberSettingsPage = lazy(() => import("./pages/project/settings/members/page"));

// User's profile page
const UserPageLayout = lazy(() => import("./pages/user/layout"));
const UserProfilePage = lazy(() => import("./pages/user/page"));

// Search page
const SearchPageLayout = lazy(() => import("@/src/pages/search/layout"));

const projectPageRoutes = () => {
    return ["project", ...projectTypes].map((type) => ({
        path: `${type}/:slug`,
        element: (
            <ProjectContextProvider>
                <Outlet />
            </ProjectContextProvider>
        ),
        children: [
            {
                path: "",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <ProjectPageLayout projectType={type} />
                    </Suspense>
                ),
                children: [
                    {
                        path: "",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <ProjectPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "gallery",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <ProjectGallery />
                            </Suspense>
                        ),
                    },
                    {
                        path: "changelog",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <VersionChangelogs />
                            </Suspense>
                        ),
                    },
                    {
                        path: "versions",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <ProjectVersionsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "version",
                        element: (
                            <>
                                <Outlet />
                            </>
                        ),
                        children: [
                            {
                                path: "new",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <UploadVersionPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: ":versionSlug",
                                element: <Outlet />,
                                children: [
                                    {
                                        path: "",
                                        element: (
                                            <Suspense fallback={<SuspenseFallback />}>
                                                <VersionPage projectType={type} />
                                            </Suspense>
                                        ),
                                    },
                                    {
                                        path: "edit",
                                        element: (
                                            <Suspense fallback={<SuspenseFallback />}>
                                                <EditVersionPage />
                                            </Suspense>
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                path: "settings",
                element: (
                    <>
                        <RedirectIfNotLoggedIn redirectTo="/login">
                            <Suspense fallback={<SuspenseFallback />}>
                                <ProjectSettingsLayout projectType={type} />
                            </Suspense>
                        </RedirectIfNotLoggedIn>
                    </>
                ),
                children: [
                    {
                        path: "",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <GeneralSettingsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "description",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <DescriptionSettings />
                            </Suspense>
                        ),
                    },
                    {
                        path: "tags",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <TagsSettingsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "links",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <ExternalLinksSettingsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "license",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <LicenseSettingsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "members",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <ProjectMemberSettingsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "*",
                        element: <NotFoundPage />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    }));
};

const searchPageRoutes = () => {
    return projectTypes.map((type) => ({
        path: `${type}s`,
        element: (
            <Suspense fallback={<SuspenseFallback />}>
                <SearchPageLayout type={type} />
            </Suspense>
        ),
    }));
};

const router = createBrowserRouter([
    {
        path: "",
        element: <Outlet />,
        errorElement: (
            <Suspense fallback={<SuspenseFallback />}>
                <ErrorView />
            </Suspense>
        ),
        children: [
            {
                path: "auth/callback/:authProvider",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <ContextProviders>
                            <OAuthCallbackPage />
                        </ContextProviders>
                    </Suspense>
                ),
            },
            {
                path: "auth/revoke-session",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <ContextProviders>
                            <RevokeSessionPage />
                        </ContextProviders>
                    </Suspense>
                ),
            },
            {
                path: "auth/confirm-action",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <ContextProviders>
                            <ConfirmActionPage />
                        </ContextProviders>
                    </Suspense>
                ),
            },
            {
                path: "",
                element: <RootLayout />,
                children: [
                    {
                        path: "",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <HomePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "login",
                        element: (
                            <RedirectIfLoggedIn redirectTo="/dashboard">
                                <Suspense fallback={<SuspenseFallback />}>
                                    <LoginPage />
                                </Suspense>
                            </RedirectIfLoggedIn>
                        ),
                    },
                    {
                        path: "signup",
                        element: (
                            <RedirectIfLoggedIn redirectTo="/dashboard">
                                <Suspense fallback={<SuspenseFallback />}>
                                    <SignUpPage />
                                </Suspense>
                            </RedirectIfLoggedIn>
                        ),
                    },
                    {
                        path: "change-password",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <ChangePasswordPage />
                            </Suspense>
                        ),
                    },
                    ...searchPageRoutes(),
                    {
                        path: "user",
                        element: <Outlet />,
                        children: [
                            {
                                path: ":userName",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <UserProfileContextProvider>
                                            <UserPageLayout />
                                        </UserProfileContextProvider>
                                    </Suspense>
                                ),
                                children: [
                                    {
                                        path: "",
                                        element: (
                                            <Suspense fallback={<SuspenseFallback />}>
                                                <UserProfilePage />
                                            </Suspense>
                                        ),
                                    },
                                    {
                                        path: ":projectType",
                                        element: (
                                            <Suspense fallback={<SuspenseFallback />}>
                                                <UserProfilePage />
                                            </Suspense>
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "settings",
                        element: (
                            <RedirectIfNotLoggedIn redirectTo="/login">
                                <Suspense fallback={<SuspenseFallback />}>
                                    <SettingsPageLayout />
                                </Suspense>
                            </RedirectIfNotLoggedIn>
                        ),
                        children: [
                            {
                                path: "",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <SettingsPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "account",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <AccountSettingsPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "sessions",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <SessionsPage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        path: "dashboard",
                        element: (
                            <RedirectIfNotLoggedIn redirectTo="/login">
                                <Suspense fallback={<SuspenseFallback />}>
                                    <DashboardLayout />
                                </Suspense>
                            </RedirectIfNotLoggedIn>
                        ),
                        children: [
                            {
                                path: "",
                                element: <RedirectIfLoggedIn redirectTo="/dashboard/overview" />,
                            },
                            {
                                path: "overview",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <OverviewPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "projects",
                                element: (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <ProjectsPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "*",
                                element: <NotFoundPage />,
                            },
                        ],
                    },
                    ...projectPageRoutes(),
                    {
                        path: "*",
                        element: (
                            <Suspense fallback={<SuspenseFallback />}>
                                <NotFoundPage />
                            </Suspense>
                        ),
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
        <RouterProvider router={router} />,
        // </StrictMode>,
    );
}

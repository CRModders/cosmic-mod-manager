import RedrectTo from "@/components/redirect-to";
import { DotsLoader } from "@/components/ui/spinner";
import "@/src/globals.css";
import { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

const SignInCallbackPage = lazy(() => import("@/src/(auth)/callbacks/signin"));
const ChangePasswordPageLayout = lazy(() => import("@/src/(auth)/change-password/layout"));
const ChangePasswordPage = lazy(() => import("@/src/(auth)/change-password/page"));
const LoginPageLayout = lazy(() => import("@/src/(auth)/login/layout"));
const LoginPage = lazy(() => import("@/src/(auth)/login/page"));
const SignupPageLayout = lazy(() => import("@/src/(auth)/signup/layout"));
const SignupPage = lazy(() => import("@/src/(auth)/signup/page"));
const VerifyActionPage = lazy(() => import("@/src/(auth)/verify-action/page"));
const MessagePage = lazy(() => import("@/src/Message"));
const DashboardPageLayout = lazy(() => import("@/src/dashboard/layout"));
const Notifications = lazy(() => import("@/src/dashboard/notifications"));
const Overview = lazy(() => import("@/src/dashboard/overview"));
const DashboardPage = lazy(() => import("@/src/dashboard/page"));
const ProjectDescription = lazy(() => import("@/src/dashboard/projects/project-details/description"));
const ProjectDetailsLayout = lazy(() => import("@/src/dashboard/projects/project-details/layout"));
const CreateVersionPage = lazy(() => import("@/src/dashboard/projects/project-details/versions/create-version"));
const EditVersionPage = lazy(() => import("@/src/dashboard/projects/project-details/versions/edit-version"));
const VersionListPage = lazy(() => import("@/src/dashboard/projects/project-details/versions/page"));
const ProjectVersionPage = lazy(() => import("@/src/dashboard/projects/project-details/versions/version-page"));
const ProjectDescriptSettingsPage = lazy(() => import("@/src/dashboard/projects/project-settings/description"));
const GeneralProjectSettings = lazy(() => import("@/src/dashboard/projects/project-settings/general"));
const ProjectSettingsLayout = lazy(() => import("@/src/dashboard/projects/project-settings/layout"));
const ProjectLinksSettings = lazy(() => import("@/src/dashboard/projects/project-settings/links"));
const Projects = lazy(() => import("@/src/dashboard/projects/projects"));
const ReportsPage = lazy(() => import("@/src/dashboard/reports"));
const NotFoundPage = lazy(() => import("@/src/not-found"));
const AccountSettingsPage = lazy(() => import("@/src/settings/account/page"));
const SettingsPageLayout = lazy(() => import("@/src/settings/layout"));
const SettingsPage = lazy(() => import("@/src/settings/page"));

const RootLayout = lazy(() => import("@/src/App"));
const HomePage = lazy(() => import("@/src/home"));
const Sessions = lazy(() => import("@/src/settings/session/page"));
const ProjectContextProvider = lazy(() => import("@/src/providers/project-context"));

const projectRoute = (project_type: string) => {
	return {
		path: project_type,
		element: <Outlet />,
		children: [
			{
				path: "",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<NotFoundPage />
					</Suspense>
				),
			},
			{
				path: ":projectUrlSlug",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<ProjectContextProvider>
							<Outlet />
						</ProjectContextProvider>
					</Suspense>
				),
				children: [
					{
						path: "",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<ProjectDetailsLayout />
							</Suspense>
						),
						children: [
							{
								path: "",
								element: <RedrectTo destinationUrl="description" />,
							},
							{
								path: "description",
								element: (
									<Suspense fallback={<SuspenseFallback />}>
										<ProjectDescription />
									</Suspense>
								),
							},
							{
								path: "gallery",
								element: <p>Project gallery</p>,
							},
							{
								path: "changelog",
								element: <p>Changelogs</p>,
							},
							{
								path: "versions",
								element: (
									<Suspense fallback={<SuspenseFallback />}>
										<VersionListPage projectType={project_type} />
									</Suspense>
								),
							},
							{
								path: "version",
								element: <Outlet />,
								children: [
									{
										path: "create",
										element: (
											<Suspense fallback={<SuspenseFallback />}>
												<CreateVersionPage projectType={project_type} />
											</Suspense>
										),
									},
									{
										path: ":versionUrlSlug",
										element: <Outlet />,
										children: [
											{
												path: "",
												element: (
													<Suspense fallback={<SuspenseFallback />}>
														<ProjectVersionPage projectType={project_type} />
													</Suspense>
												),
											},
											{
												path: "edit",
												element: (
													<Suspense fallback={<SuspenseFallback />}>
														<EditVersionPage projectType={project_type} />
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
							<Suspense fallback={<SuspenseFallback />}>
								<ProjectSettingsLayout projectType={project_type} />
							</Suspense>
						),
						children: [
							{
								path: "",
								element: (
									<Suspense fallback={<SuspenseFallback />}>
										<RedrectTo destinationUrl="general" />
									</Suspense>
								),
							},
							{
								path: "general",
								element: (
									<Suspense fallback={<SuspenseFallback />}>
										<GeneralProjectSettings />
									</Suspense>
								),
							},
							{
								path: "description",
								element: (
									<Suspense fallback={<SuspenseFallback />}>
										<ProjectDescriptSettingsPage />
									</Suspense>
								),
							},
							{
								path: "links",
								element: (
									<Suspense fallback={<SuspenseFallback />}>
										<ProjectLinksSettings />
									</Suspense>
								),
							},
						],
					},
				],
			},
		],
	};
};

const getProjectPageRoutes = () => {
	const projectTypes = ["mod", "modpack", "resource-pack", "data-pack", "plugin", "shader", "project"];

	const projectRouteType = projectRoute("a");

	const list: (typeof projectRouteType)[] = [];

	for (const project_type of projectTypes) {
		list.push(projectRoute(project_type));
	}

	return list;
};

const SuspenseFallback = () => {
	return (
		<div className="w-full flex items-center justify-center py-12">
			<DotsLoader />
		</div>
	);
};

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<RootLayout />
			</Suspense>
		),
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
					<Suspense fallback={<SuspenseFallback />}>
						<LoginPageLayout />
					</Suspense>
				),
				children: [
					{
						path: "",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<LoginPage />
							</Suspense>
						),
					},
				],
			},
			{
				path: "signup",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<SignupPageLayout />
					</Suspense>
				),
				children: [
					{
						path: "",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<SignupPage />
							</Suspense>
						),
					},
				],
			},
			{
				path: "change-password",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<ChangePasswordPageLayout />
					</Suspense>
				),
				children: [
					{
						path: "",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<ChangePasswordPage />
							</Suspense>
						),
					},
				],
			},
			{
				path: "settings",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<SettingsPageLayout />
					</Suspense>
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
								<Sessions />
							</Suspense>
						),
					},
				],
			},
			{
				path: "dashboard",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<DashboardPageLayout />
					</Suspense>
				),
				children: [
					{
						path: "",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<DashboardPage />
							</Suspense>
						),
					},
					{
						path: "overview",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<Overview />
							</Suspense>
						),
					},
					{
						path: "notifications",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<Notifications />
							</Suspense>
						),
					},
					{
						path: "reports",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<ReportsPage />
							</Suspense>
						),
					},
					{
						path: "projects",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<Projects />
							</Suspense>
						),
					},
					{
						path: "*",
						element: (
							<Suspense fallback={<SuspenseFallback />}>
								<p>DASHBOARD_PAGE</p>
							</Suspense>
						),
					},
				],
			},
			...getProjectPageRoutes(),
			{
				path: "auth/callback/:authProvider",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<SignInCallbackPage />
					</Suspense>
				),
			},
			{
				path: "verify-action",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<VerifyActionPage />
					</Suspense>
				),
			},
			{
				path: "message",
				element: (
					<Suspense fallback={<SuspenseFallback />}>
						<MessagePage />
					</Suspense>
				),
			},
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
]);

ReactDOM.createRoot(
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	document.getElementById("root")!,
).render(<RouterProvider router={router} />);

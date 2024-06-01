import RedrectTo from "@/components/redirect-to";
import RootLayout, { HomePage } from "@/src/App";
import ProjectSettingsLayout from "@/src/dashboard/projects/project-settings/layout";
import "@/src/globals.css";
import NotFoundPage from "@/src/not-found";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { SignInCallbackPage } from "./(auth)/callbacks/signin";
import ChangePasswordPageLayout from "./(auth)/change-password/layout";
import ChangePasswordPage from "./(auth)/change-password/page";
import LoginPageLayout from "./(auth)/login/layout";
import LoginPage from "./(auth)/login/page";
import SignupPageLayout from "./(auth)/signup/layout";
import SignupPage from "./(auth)/signup/page";
import VerifyActionPage from "./(auth)/verify-action/page";
import MessagePage from "./Message";
import DashboardPageLayout from "./dashboard/layout";
import Notifications from "./dashboard/notifications";
import Overview from "./dashboard/overview";
import DashboardPage from "./dashboard/page";
import ProjectDescription from "./dashboard/projects/project-details/description";
import ProjectDetailsLayout from "./dashboard/projects/project-details/layout";
import GeneralProjectSettings from "./dashboard/projects/project-settings/general";
import Projects from "./dashboard/projects/projects";
import ReportsPage from "./dashboard/reports";
import AccountSettingsPage from "./settings/account/page";
import SettingsPageLayout from "./settings/layout";
import SettingsPage from "./settings/page";
import Sessions from "./settings/session/page";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "",
				element: <HomePage />,
			},
			{
				path: "login",
				element: <LoginPageLayout />,
				children: [
					{
						path: "",
						element: <LoginPage />,
					},
				],
			},
			{
				path: "signup",
				element: <SignupPageLayout />,
				children: [
					{
						path: "",
						element: <SignupPage />,
					},
				],
			},
			{
				path: "change-password",
				element: <ChangePasswordPageLayout />,
				children: [
					{
						path: "",
						element: <ChangePasswordPage />,
					},
				],
			},
			{
				path: "settings",
				element: <SettingsPageLayout />,
				children: [
					{
						path: "",
						element: <SettingsPage />,
					},
					{
						path: "account",
						element: <AccountSettingsPage />,
					},
					{
						path: "sessions",
						element: <Sessions />,
					},
				],
			},
			{
				path: "dashboard",
				element: <DashboardPageLayout />,
				children: [
					{
						path: "",
						element: <DashboardPage />,
					},
					{
						path: "overview",
						element: <Overview />,
					},
					{
						path: "notifications",
						element: <Notifications />,
					},
					{
						path: "reports",
						element: <ReportsPage />,
					},
					{
						path: "projects",
						element: <Projects />,
					},
					{
						path: "*",
						element: <p>DASHBOARD_PAGE</p>,
					},
				],
			},
			{
				path: "project",
				element: <Outlet />,
				children: [
					{
						path: "",
						element: <NotFoundPage />,
					},
					{
						path: ":projectUrlSlug",
						element: <Outlet />,
						children: [
							{
								path: "",
								element: <ProjectDetailsLayout />,
								children: [
									{
										path: "",
										element: <RedrectTo destinationUrl="description" />,
									},
									{
										path: "description",
										element: <ProjectDescription />,
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
										element: <p>Project versions</p>,
									},
								],
							},
							{
								path: "settings",
								element: <ProjectSettingsLayout />,
								children: [
									{
										path: "",
										element: <RedrectTo destinationUrl="general" />,
									},
									{
										path: "general",
										element: <GeneralProjectSettings />,
									},
								],
							},
						],
					},
				],
			},
			{
				path: "auth/callback/:authProvider",
				element: <SignInCallbackPage />,
			},
			{
				path: "verify-action",
				element: <VerifyActionPage />,
			},
			{
				path: "message",
				element: <MessagePage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);

ReactDOM.createRoot(
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	document.getElementById("root")!,
).render(<RouterProvider router={router} />);

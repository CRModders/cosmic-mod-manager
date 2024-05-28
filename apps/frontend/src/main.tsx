import RootLayout, { HomePage } from "@/src/App";
import "@/src/globals.css";
import NotFoundPage from "@/src/not-found";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
						path: "*",
						element: <p>DASHBOARD_PAGE</p>,
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

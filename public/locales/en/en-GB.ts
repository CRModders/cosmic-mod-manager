import { locale_meta } from "@/public/locales/interface";

export const en_gb = {
	meta: {
		language: {
			// Two letter code of that base language -> lowercase
			code: "en",

			// English name of the language -> Normal writing
			en_name: "English",

			// Name of the language in that language (It's en here so the word "English" is written it English) -> Normal writing
			locale_name: "English",
		},
		region: {
			// Two letter code of that region -> UPPERCASE
			code: "GB",

			// Name of the region (should be written in the language it is being used for) -> Normal writing
			name: "United Kingdom",

			// Any shorter name of the region if exists, else it will be same as region code,
			// For example, region code of United kingdom is "GB" but many people won't get it as UK so instead of writing "GB" in the short name, use "UK"
			// ->  UPPERCASE
			display_name: "UK",
		},
	} satisfies locale_meta,

	content: {
		globals: {
			site: {
				full_name: "Cosmic Reach Mod Manager",
				short_name: "CRMM",
			},
			mods: "Mods",
			resource_packs: "Resource packs",
			modpacks: "Modpacks",
			shaders: "Shaders",

			continue: "Continue",
			confirm: "Confirm",
			cancel: "Cancel",
			delete: "Delete",
			remove: "Remove",
			link: "Link",
			messages: {
				something_went_wrong: "Something went wrong",
				email_sent_successfully: "Email sent successfully",
				error_sending_email: "Error while sending confirmation email",
				internal_server_error: "Internal server error",
				invalid_request: "Invalid request",
				invalid_token: "Invalid token",
				expired_token: "Expired token",
				cancelled_successfully: "Cancelled successfully",
			},
		},
		api_responses: {
			user: {
				invalid_form_data: "Invalid form data",
				username_not_available: "That username is not available, try something else",
				profile_update_success: "Successfully updated profile",
				something_went_wrong_try_again: "Something went wrong! Please try again",
				email_and_pass_required: "Email and password are required",
				no_account_exists_with_that_email: "No account exists with the entered email address",
				incorrect_email_or_pass: "Incorrect email or password",
				incorrect_password: "Incorrect password",
				login_success: "Login successful",
				cant_unlink_the_last_auth_provider: "You can't unlink the only remaining auth provider",
				successfully_removed_provider: "Successfully removed ${0} provider",
				invalid_password: "Invalid password. ${0}",
				successfully_removed_password: "Successfully removed password",
				successfully_added_new_password: "Successfully added new password",
				password_login_not_enabled: "You can't change the password, you have not enabled password login.",
				password_login_not_enabled_desc:
					"Only the accounts which have password added could change the password. If not you can use auth providers to login.",
				successfully_deleted_account: "Successfully deleted your account",
				cancelled_account_deletion: "Successfully cancelled account deletion",
			},
		},
		auth: {
			dashboard: "Dashboard",
			settings: "Settings",
			your_profile: "Your profile",
			email: "Email",
			password: "Password",
			sign_up: "Sign up",
			login: "Log in",
			sign_out: "Sign out",
			invalid_session_msg: "Invalid local session",
			signing_out: "Signing out",
			something_went_wrong: "Something went wrong",

			login_page: {
				meta_desc: "Log into cosmic reach mod manager to get a more personalized experience.",
				dont_have_an_account: "Don't have an account?",
				forgot_password_msg: "Don't remember your password?",
				log_in_using: "Log In using :",
				invalid_email_msg: "Enter a valid email address",
				invalid_password_msg: "Enter a valid password",
			},
			singup_page: {
				meta_desc: "Register for an account to get upload access Cosmic Reach mod manager",
				signup_using_providers: "Sign Up using any of the auth providers",
				already_have_an_account: "Already have an account?",
			},
			change_password_page: {
				change_password: "Change password",
				meta_desc: "Reset your CRMM account password.",
				email_sent_desc: "Open the link sent to your email and change your password.",
			},
			action_verification_page: {
				invalid_token: "Expired or invalid token",
				didnt_request_email: "Didn't request the email?",
				check_sessions: "Check logged in sessions",
				verify_new_password: "Verify your new password",
				add_new_password_desc:
					"A new password was recently added to your account. Confirm below if this was you. The new password will not work until then.",
				delete_account: "Delete your account",
				delete_account_desc:
					"Deleting your account will remove all of your data except your projects from our database. There is no going back after you delete your account.",
				enter_password: "Enter your new password",
				re_enter_password: "Re-enter your password",
				max_password_length_msg: "Your password can only have a maximum of ${0} characters",
				password_dont_match: "Passwords do not match",
				cancelled_successfully: "Cancelled successfully",
				password_changed: "Successfully changed password",
				new_password: "New password",
				confirm_new_password: "Confirm new password",
			},
		},
		home_page: {
			hero: {
				description: {
					line_1: "The best place for your [Cosmic Reach] mods.",
					line_2: "Discover, play, and create content, all in one spot.",
				},
				explore_mods: "Explore mods",
			},
			featured_section: {
				popular_mods: "Popular mods",
				popular_resource_packs: "Popular resource packs",
			},
		},
		user_profile_page: {
			meta_desc: "${0}'s profile on CRMM",
		},

		settings_page: {
			meta_desc: "Account settings",
			account_section: {
				meta_title: "Account settings",
				account: "Account",
				user_profile: "User profile",
				edit: "Edit",
				edit_profile: "Edit profile",
				enter_username: "Enter your username",
				enter_name: "Enter your name",
				username_max_chars_limit: "Your username can only have a maximum of ${0} characters",
				name_max_chars_limit: "Your name can only have a maximum of ${0} characters",
				pfp_provider: "Profile image provider",
				username: "Username",
				full_name: "Full name",
				save_profile: "Save profile",
				account_security: "Account security",
				add_a_password_msg: "Add a password to use credentials login",
				change_account_password: "Change your account password",
				add_password: "Add password",
				remove_password: "Remove password",
				enter_your_password: "Enter your password",
				remove_account_password: "Remove your account password",
				manage_auth_providers: "Manage authentication providers",
				manage_auth_providers_desc: "Add or remove login methods from your account.",
				manage_providers_label: "Manage providers",
				provider_email_tooltip: "The email of the linked ${0} account",
				auth_providers_label: "Authentication providers",
				link_a_provier: "Link ${0} provider",
				delete_account: "Delete account",
				deletion_email_sent_desc:
					"A confirmation email has been sent to your email addres. Confirm there to delete your account.",
				account_deletion_desc:
					"Once you delete your account, there is no going back. Deleting your account will remove all of your data, except your projects, from our servers.",
				confirm_to_delete_account: "Are you sure that you want to delete your account.",
			},
			sessions_section: {
				sessions: "Sessions",
				meta_desc: "Manage logged in sessions",
				page_desc: {
					line_1:
						"Here are all the devices that are currently logged in with your account. You can log out of each one individually.",
					line_2:
						"If you see an entry you don't recognize, log out of that device and change the password of the account which was used to create that session.",
				},
				current_session: "Current session",
				timestamp_template: "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}",
				last_used: "Last used",
				created: "Created",
				time_past_phrases: {
					// should be in lower case, adjust the position of ${0} according to the translation in other languages
					just_now: "just now",
					minute_ago: "${0} minute ago",
					minutes_ago: "${0} minutes ago",
					hour_ago: "${0} hour ago",
					hours_ago: "${0} hours ago",
					day_ago: "${0} day ago",
					days_ago: "${0} days ago",
					week_ago: "${0} week ago",
					weeks_ago: "${0} weeks ago",
					month_ago: "${0} month ago",
					months_ago: "${0} months ago",
					year_ago: "${0} year ago",
					years_ago: "${0} years ago",
				},
				session_created_using_provider: "This session was created using ${0} provider",
				revoke_session: "Revoke session",
			},
		},

		footer: {
			site_desc: "A one stop solution for cosmic reach content. Mods, shaders, resource packs, modpacks and more",
			socials: "Socials",
			explore: "Explore",
			privacy_policy: "Privacy policy",
			terms: "Terms",
			change_theme: "Change theme",
		},
	}, // satisfies locale_content_type,
};

// The above satisfies statement must be used in other locales, it can't be used here, because en-Gb's content is providing the base type
// Its own type can't be used to constraint itself
// Stupid note: That comma before the "satisfies" keyword come after that statement as in the meta object above

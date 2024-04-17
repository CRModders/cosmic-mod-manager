import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		borderRadius: {
			// none: "0px",
			// sm: "0.125rem",
			// DEFAULT: "0.25rem",
			// md: "0.375rem",
			// lg: "0.5rem",
			// xl: "0.75rem",
			// "2xl": "1rem",
			// "3xl": "1.5rem",
			// full: "9999px",
		},
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			transitionDuration: {
				default: "300ms",
			},
			colors: {
				background: colors.zinc[50],
				background_hover: colors.zinc[200],
				foreground: colors.zinc[900],
				foreground_muted: colors.zinc[600],
				shadow: colors.zinc[300],
				danger: colors.red[600],
				success: colors.emerald[600],

				background_dark: colors.zinc[900],
				background_hover_dark: colors.zinc[800],
				foreground_dark: colors.zinc[50],
				foreground_muted_dark: colors.zinc[300],
				shadow_dark: colors.zinc[700],
				danger_dark: colors.red[500],
				success_dark: colors.emerald[500],

				primary_accent: colors.rose[500],
				primary_accent_foreground: colors.zinc[50],
				primary_accent_text: colors.rose[600],

				primary_accent_dark: colors.rose[500],
				primary_accent_foreground_dark: colors.zinc[50],
				primary_accent_text_dark: colors.rose[400],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

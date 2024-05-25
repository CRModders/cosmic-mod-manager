/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./components/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./index.html",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                "2xl": '1536px',
            },
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
            colors: {
                "accent-bg": "hsla(var(--accent-bg))",
                "accent-foreground": "hsla(var(--accent-foreground))",
                background: "hsla(var(--background))",
                "background-shallow": "hsla(var(--background-shallow))",
                foreground: "hsla(var(--foreground))",
                "foreground-muted": "hsla(var(--foreground-muted))",
                "bg-hover": "hsla(var(--bg-hover))",
                "danger-bg": "hsla(var(--danger-bg))",
                "danger-text": "hsla(var(--danger-text))",
                "success-bg": "hsla(var(--success-bg))",
                "success-text": "hsla(var(--success-text))",
                shadow: "hsla(var(--shadow))",
                border: "hsla(var(--border))",
                "border-hicontrast": "hsla(var(--border-hicontrast))"
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

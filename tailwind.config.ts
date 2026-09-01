import type { Config } from "tailwindcss";

export default {
	darkMode: ["selector", '[data-theme="dark"]'],
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
			screens: { "2xl": "1400px" },
		},
		extend: {
			fontFamily: {
				archivo: ["Archivo", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			colors: {
				// Map every prototype token to a CSS variable so both themes work.
				// Components use e.g. bg-canvas, text-primary, border-line, etc.
				canvas:       "var(--bg)",
				surface:      "var(--bg-1)",
				raised:       "var(--bg-2)",
				primary:      "var(--text)",
				dim:          "var(--text-dim)",
				faint:        "var(--text-faint)",
				accent:       "var(--accent)",
				"accent-ink": "var(--accent-ink)",
				"accent-dim": "var(--accent-dim)",
				line:         "var(--line)",
				"line-2":     "var(--line-2)",
				// shadcn/ui-compatible aliases (keeps any installed shadcn components working)
				background:   "var(--bg)",
				foreground:   "var(--text)",
				border:       "var(--line)",
				input:        "var(--bg-1)",
				ring:         "var(--accent)",
				card: {
					DEFAULT:    "var(--bg-1)",
					foreground: "var(--text)",
				},
				popover: {
					DEFAULT:    "var(--bg-1)",
					foreground: "var(--text)",
				},
				secondary: {
					DEFAULT:    "var(--bg-1)",
					foreground: "var(--text-dim)",
				},
				muted: {
					DEFAULT:    "var(--bg-1)",
					foreground: "var(--text-faint)",
				},
				destructive: {
					DEFAULT:    "hsl(0 84% 60%)",
					foreground: "hsl(0 0% 98%)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to:   { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to:   { height: "0" },
				},
				heroLine: {
					from: { transform: "translateY(105%)" },
					to:   { transform: "translateY(0)" },
				},
				cue: {
					"0%":       { transform: "translateY(-100%)" },
					"60%,100%": { transform: "translateY(300%)" },
				},
				marquee: {
					to: { transform: "translateX(-50%)" },
				},
				routeIn: {
					from: { transform: "translateY(16px)", opacity: "0" },
					to:   { transform: "translateY(0)",    opacity: "1" },
				},
				pulse: {
					"0%,100%": { opacity: "0.25", transform: "scale(0.8)" },
					"50%":     { opacity: "1",    transform: "scale(1)" },
				},
				"pulse-glow": {
					"0%,100%": { boxShadow: "0 0 20px var(--accent-dim)" },
					"50%":     { boxShadow: "0 0 40px var(--accent-dim)" },
				},
				float: {
					"0%,100%": { transform: "translateY(0px)" },
					"50%":     { transform: "translateY(-10px)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up":   "accordion-up 0.2s ease-out",
				"hero-line":      "heroLine 1.05s cubic-bezier(.16,1,.3,1) both",
				cue:              "cue 1.9s cubic-bezier(.7,0,.3,1) infinite",
				marquee:          "marquee 42s linear infinite",
				"route-in":       "routeIn 0.55s cubic-bezier(.16,1,.3,1) both",
				pulse:            "pulse 1.1s ease-in-out infinite",
				"pulse-glow":     "pulse-glow 2s ease-in-out infinite",
				float:            "float 3s ease-in-out infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

import { PreferenceTheme } from "./api/user/preferences";

export type Theme = Exclude<PreferenceTheme, "system">;

export function resolveTheme(theme: PreferenceTheme = "light"): Theme {
	return theme === "system"
		? matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light"
		: theme;
}

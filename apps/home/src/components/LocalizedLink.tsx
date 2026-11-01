import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { useCallback } from "react";
import {
	type LinkProps,
	type NavigateOptions,
	Link as RouterLink,
	useNavigate,
} from "react-router-dom";
import { localizePath } from "../lib/locale";

function useLocalize() {
	const { language } = useI18n();
	return useCallback(
		(to: string) => (to.startsWith("/") ? localizePath(to, language) : to),
		[language],
	);
}

/**
 * Drop-in for react-router's Link: absolute string paths are written
 * unprefixed (`/apply`) and resolved against the current URL language,
 * so English pages keep linking within /en.
 */
export function Link({ to, ...props }: LinkProps) {
	const localize = useLocalize();
	return (
		<RouterLink to={typeof to === "string" ? localize(to) : to} {...props} />
	);
}

export function useLocalizedNavigate() {
	const navigate = useNavigate();
	const localize = useLocalize();
	return useCallback(
		(to: string, options?: NavigateOptions) => navigate(localize(to), options),
		[navigate, localize],
	);
}

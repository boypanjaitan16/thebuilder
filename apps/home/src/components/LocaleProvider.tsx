import { I18nProvider } from "@thebuilder/shared/i18n/I18nProvider";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath } from "../lib/locale";

/** Feeds the URL language (`/en/**` = English, else Indonesian) to i18n. */
export function LocaleProvider({ children }: PropsWithChildren) {
	const { pathname } = useLocation();
	return (
		<I18nProvider language={getLanguageFromPath(pathname)}>
			{children}
		</I18nProvider>
	);
}

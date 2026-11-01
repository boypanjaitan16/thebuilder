import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Copy, type Language, translations } from "./translations";

type I18nContextValue = {
	language: Language;
	setLanguage: (lang: Language) => void;
	copy: Copy;
};

const I18nContext = createContext<I18nContextValue>({
	language: "id",
	setLanguage: () => undefined,
	copy: translations.id,
});

type I18nProviderProps = PropsWithChildren<{
	/**
	 * When set, the provider is controlled (home derives it from the URL)
	 * and never reads or writes localStorage; setLanguage is a no-op.
	 */
	language?: Language;
}>;

export function I18nProvider({
	children,
	language: controlledLanguage,
}: I18nProviderProps) {
	const isControlled = controlledLanguage !== undefined;
	const [storedLanguage, setStoredLanguage] = useState<Language>("id");
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (isControlled) return;
		const stored = window.localStorage.getItem("tb_lang");
		if (stored === "en" || stored === "id") {
			setStoredLanguage(stored);
		}
		setInitialized(true);
	}, [isControlled]);

	useEffect(() => {
		if (!isControlled && initialized)
			window.localStorage.setItem("tb_lang", storedLanguage);
	}, [isControlled, initialized, storedLanguage]);

	const language = controlledLanguage ?? storedLanguage;

	const value = useMemo<I18nContextValue>(
		() => ({
			language,
			setLanguage: isControlled ? () => undefined : setStoredLanguage,
			copy: translations[language],
		}),
		[language, isControlled],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	return useContext(I18nContext);
}

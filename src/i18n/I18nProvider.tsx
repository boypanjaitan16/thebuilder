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

export function I18nProvider({ children }: PropsWithChildren) {
	const [language, setLanguage] = useState<Language>("id");
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		const stored = window.localStorage.getItem("tb_lang");
		if (stored === "en" || stored === "id") {
			setLanguage(stored);
		}
		setInitialized(true);
	}, []);

	useEffect(() => {
		if (initialized) window.localStorage.setItem("tb_lang", language);
	}, [initialized, language]);

	const value = useMemo<I18nContextValue>(
		() => ({
			language,
			setLanguage,
			copy: translations[language],
		}),
		[language],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	return useContext(I18nContext);
}

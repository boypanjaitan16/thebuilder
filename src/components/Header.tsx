import classNames from "classnames";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

export function Header() {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const { copy, language, setLanguage } = useI18n();

	useEffect(() => {
		setOpen(false);
	}, [location.pathname]);

	return (
		<header className="sticky top-0 z-20 border-b border-ink  bg-white backdrop-blur">
			<div className="container-page flex flex-col gap-3 py-3 md:pt-5 md:pb-3 px-5 xl:px-0">
				<div className="flex flex-row items-center justify-between">
					<NavLink to="/" className="flex items-center gap-3">
						<div className="text-left leading-tight">
							<p className="font-bold font-display text-2xl uppercase text-ink">
								The Builder
							</p>
							<p className="font-display text-[10px] md:text-[11px] font-semibold text-slate-500">
								Building Organization That Scale
							</p>
						</div>
					</NavLink>

					<div className="flex items-center gap-3">
						<div className="flex rounded-full border border-sand bg-white p-1 text-xs font-semibold shadow-sm">
							<button
								type="button"
								onClick={() => setLanguage("en")}
								className={classNames(
									"rounded-full px-2 md:px-4 py-1 md:py-2 transition",
									language === "en"
										? "bg-ink text-white shadow-soft"
										: "text-slate-700",
								)}
							>
								EN
							</button>
							<button
								type="button"
								onClick={() => setLanguage("id")}
								className={classNames(
									"rounded-full px-2 md:px-4 py-1 md:py-2 transition",
									language === "id"
										? "bg-ink text-white shadow-soft"
										: "text-slate-700",
								)}
							>
								ID
							</button>
						</div>
						<button
							type="button"
							className="inline-flex size-9 md:size-11 items-center justify-center rounded-xl border border-sand bg-white text-ink shadow-sm transition hover:border-ink md:hidden"
							aria-label={open ? "Close navigation" : "Open navigation"}
							onClick={() => setOpen((prev) => !prev)}
						>
							<div className="relative h-4 w-4">
								<span
									className={classNames(
										"absolute inset-x-0 top-0 h-0.5 bg-ink transition",
										open && "translate-y-2 rotate-45",
									)}
								/>
								<span
									className={classNames(
										"absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink transition",
										open && "opacity-0",
									)}
								/>
								<span
									className={classNames(
										"absolute inset-x-0 bottom-0 h-0.5 bg-ink transition",
										open && "-translate-y-2 -rotate-45",
									)}
								/>
							</div>
						</button>
						<NavLink
							to="/apply"
							className="hidden items-center justify-center rounded-full border border-ink px-5 py-2 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 md:inline-flex"
						>
							{copy.nav.apply}
						</NavLink>
					</div>
				</div>
				<div
					className={classNames(
						"w-full flex-col gap-5 md:w-auto md:flex-row md:items-center border-t pt-3",
						open ? "flex" : "hidden md:flex",
					)}
				>
					<nav className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-3 overflow-x-auto">
						{[
							{ label: copy.nav.home, to: "/" },
							{
								label: copy.nav.organization,
								to: "/organization-transformation",
							},
							{ label: copy.nav.future, to: "/future-talent-strategy" },
							{ label: copy.nav.risk, to: "/risk-and-business-continuity" },
							{ label: copy.nav.insights, to: "/insights" },
							{ label: copy.nav.work, to: "/work-with-me" },
							{ label: copy.nav.resources, to: "/resources" },
						].map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									classNames(
										"rounded-full px-4 py-2 transition-all duration-150 truncate",
										isActive
											? "bg-ink text-white shadow-soft"
											: "text-slate-700 hover:bg-sand/70 hover:text-ink",
									)
								}
								title={item.label}
							>
								{item.label}
							</NavLink>
						))}
					</nav>
					<NavLink
						to="/apply"
						className="inline-flex items-center justify-center rounded-full border border-ink px-4 py-3 text-sm font-semibold text-ink shadow-soft w-full md:hidden"
					>
						{copy.nav.apply}
					</NavLink>
				</div>
			</div>
		</header>
	);
}

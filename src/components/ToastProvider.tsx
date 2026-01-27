import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import classNames from "classnames";

type ToastTone = "success" | "error" | "info";

type Toast = {
	id: string;
	message: string;
	tone: ToastTone;
	visible: boolean;
};

type ToastOptions = {
	tone?: ToastTone;
	durationMs?: number;
};

type ToastContextValue = {
	showToast: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_HIDE_DELAY = 220;

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const timeouts = useRef<number[]>([]);

	const showToast = useCallback((message: string, options?: ToastOptions) => {
		const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
		const tone = options?.tone ?? "success";
		const duration = options?.durationMs ?? 2800;
		setToasts((prev) => [...prev, { id, message, tone, visible: false }]);

		requestAnimationFrame(() => {
			setToasts((prev) =>
				prev.map((toast) =>
					toast.id === id ? { ...toast, visible: true } : toast,
				),
			);
		});

		const hideTimeout = window.setTimeout(() => {
			setToasts((prev) =>
				prev.map((toast) =>
					toast.id === id ? { ...toast, visible: false } : toast,
				),
			);
		}, duration);
		const removeTimeout = window.setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, duration + TOAST_HIDE_DELAY);

		timeouts.current.push(hideTimeout, removeTimeout);
	}, []);

	const contextValue = useMemo(() => ({ showToast }), [showToast]);

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			<div className="pointer-events-none fixed top-4 left-1/2 z-50 -translate-x-1/2 space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={classNames(
							"pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition-all duration-200",
							toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
							toast.tone === "success" && "bg-emerald-600 text-white",
							toast.tone === "error" && "bg-red-600 text-white",
							toast.tone === "info" && "bg-ink text-white",
						)}
					>
						{toast.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}

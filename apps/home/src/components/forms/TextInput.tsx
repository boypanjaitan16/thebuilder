import classNames from "classnames";
import type { InputHTMLAttributes } from "react";

type TextInputProps = {
	label: string;
	errorMessage?: string | null;
	inputProps?: InputHTMLAttributes<HTMLInputElement>;
	inputClassName?: string;
};

export function TextInput({
	label,
	errorMessage,
	inputProps,
	inputClassName,
}: TextInputProps) {
	return (
		<label
			className={classNames(
				"flex w-full flex-col gap-1 text-sm font-medium ",
				errorMessage ? "text-red-600" : "text-ink",
			)}
		>
			{label}
			<input
				{...inputProps}
				aria-invalid={Boolean(errorMessage)}
				className={classNames(
					"w-full rounded-xl border bg-white px-4 py-3 text-base text-ink outline-none transition focus:ring-2",
					errorMessage
						? "border-red-400 focus:border-red-500 focus:ring-red-200"
						: "border-sand focus:border-ink focus:ring-ink/10",
					inputClassName,
				)}
			/>
			{errorMessage && (
				<span className="text-xs text-red-600">{errorMessage}</span>
			)}
		</label>
	);
}

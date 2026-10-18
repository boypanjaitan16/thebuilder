import classNames from "classnames";
import type { SelectHTMLAttributes } from "react";

type Option = { label: string; value: string };

type SelectBoxProps = {
	label: string;
	options: Option[];
	placeholder?: string;
	errorMessage?: string | null;
	selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
	selectClassName?: string;
};

export function SelectBox({
	label,
	options,
	placeholder,
	errorMessage,
	selectProps,
	selectClassName,
}: SelectBoxProps) {
	return (
		<label
			className={classNames(
				"flex w-full flex-col gap-1 text-sm font-medium ",
				errorMessage ? "text-red-600" : "text-ink",
			)}
		>
			{label}
			<select
				{...selectProps}
				aria-invalid={Boolean(errorMessage)}
				className={classNames(
					"w-full rounded-xl border bg-white px-4 py-3 text-base text-ink outline-none transition focus:ring-2",
					errorMessage
						? "border-red-400 focus:border-red-500 focus:ring-red-200"
						: "border-sand focus:border-ink focus:ring-ink/10",
					selectClassName,
				)}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{errorMessage && (
				<span className="text-xs text-red-600">{errorMessage}</span>
			)}
		</label>
	);
}

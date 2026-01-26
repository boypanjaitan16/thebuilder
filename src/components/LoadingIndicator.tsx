type LoadingIndicatorProps = {
	label?: string;
	size?: number;
	className?: string;
};

function LoadingIndicator({
	label = "Loading",
	size = 32,
	className = "",
}: LoadingIndicatorProps) {
	return (
		<div
			className={`inline-flex items-center gap-3 text-sm text-slate-600 ${className}`}
			role="status"
			aria-label={label}
		>
			<span
				className="inline-block animate-spin rounded-full border-2 border-slate-300 border-t-ink"
				style={{ width: size, height: size }}
			/>
			{label && <span>{label}</span>}
		</div>
	);
}

export default LoadingIndicator;

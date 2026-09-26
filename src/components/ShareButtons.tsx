import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ToastProvider";

// Brand logos aren't in lucide-react (it deliberately excludes brand/logo
// marks) — these are the official MIT-licensed paths from simple-icons
// (simple-icons.org), embedded inline rather than adding a whole icon
// package as a dependency for just four glyphs.
function FacebookIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
		</svg>
	);
}

function LinkedInIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

function XIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
		</svg>
	);
}

function WhatsAppIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
		</svg>
	);
}

type ShareButtonsProps = {
	title: string;
	url: string;
};

const buttonClassName =
	"inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white text-ink transition hover:-translate-y-0.5 hover:border-ink hover:bg-mist";

export function ShareButtons({ title, url }: ShareButtonsProps) {
	const { showToast } = useToast();
	const [copied, setCopied] = useState(false);
	const canNativeShare =
		typeof navigator !== "undefined" && typeof navigator.share === "function";

	const handleNativeShare = async () => {
		try {
			await navigator.share({ title, url });
		} catch {
			// User cancelled the share sheet — not an error, nothing to do.
		}
	};

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			showToast("Link copied to clipboard", { tone: "success" });
			setTimeout(() => setCopied(false), 2000);
		} catch {
			showToast("Failed to copy link", { tone: "error" });
		}
	};

	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	const socialLinks = [
		{
			label: "Share on Facebook",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			icon: <FacebookIcon />,
		},
		{
			label: "Share on X",
			href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
			icon: <XIcon />,
		},
		{
			label: "Share on LinkedIn",
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			icon: <LinkedInIcon />,
		},
		{
			label: "Share on WhatsApp",
			href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
			icon: <WhatsAppIcon />,
		},
	];

	return (
		<div className="flex flex-row items-center justify-center gap-2 md:sticky md:top-40 md:flex-col md:items-stretch md:gap-3 md:self-start">
			{canNativeShare && (
				<button
					type="button"
					onClick={() => void handleNativeShare()}
					title="Share"
					className={buttonClassName}
				>
					<Share2 size={16} />
				</button>
			)}
			{socialLinks.map((link) => (
				<a
					key={link.label}
					href={link.href}
					target="_blank"
					rel="noreferrer noopener"
					title={link.label}
					className={buttonClassName}
				>
					{link.icon}
				</a>
			))}
			<button
				type="button"
				onClick={() => void handleCopyLink()}
				title={copied ? "Copied" : "Copy link"}
				className={buttonClassName}
			>
				{copied ? <Check size={16} /> : <Copy size={16} />}
			</button>
		</div>
	);
}

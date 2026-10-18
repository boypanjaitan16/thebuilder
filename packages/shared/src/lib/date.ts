import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

/**
 * Formats an ISO date string for display in the admin portal, e.g. "25 Sep 2026".
 */
export function formatDate(value: string): string {
	return dayjs(value).format("D MMM YYYY");
}

/**
 * Current timestamp as an ISO string, for Firestore `created_at`/`updated_at` fields.
 */
export function nowIso(): string {
	return dayjs().toISOString();
}

import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

if (!env.supabaseUrl || !env.supabaseAnonKey) {
	// biome-ignore lint/suspicious/noConsole: OK
	console.warn(
		"Supabase credentials are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
	);
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

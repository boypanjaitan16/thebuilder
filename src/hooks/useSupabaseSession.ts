import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type SupabaseSession =
	Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

export function useSupabaseSession() {
	const [session, setSession] = useState<SupabaseSession>(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setChecking(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, newSession) => {
				setSession(newSession);
			},
		);

		return () => listener?.subscription.unsubscribe();
	}, []);

	const isAuthenticated = useMemo(() => Boolean(session), [session]);

	return { session, checking, isAuthenticated };
}

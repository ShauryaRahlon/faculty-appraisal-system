"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { hydrateFromServer } from "@/lib/localStorage";

/**
 * useServerSync — Hydrates localStorage from MongoDB on mount.
 *
 * When a faculty member opens the app in a new browser/incognito/device,
 * this hook fetches their saved progress from the server and restores it
 * into localStorage so all form pages see the correct data.
 *
 * Must be used inside a NextAuth SessionProvider.
 */
export function useServerSync() {
	const { data: session, status } = useSession();
	const hasHydrated = useRef(false);

	useEffect(() => {
		// Only run once per session, after auth is resolved
		if (status !== "authenticated" || hasHydrated.current) return;
		if (!session?.user) return;

		const user = session.user as { employeeCode?: string; id?: string };
		const userId = user.employeeCode || user.id;

		if (!userId) return;

		// Ensure user_id is in localStorage (SessionSync may not have run yet)
		if (localStorage.getItem("user_id") !== userId) {
			localStorage.setItem("user_id", userId);
		}

		// Hydrate from server (forcefully overwrites localStorage to ensure DB is the source of truth)
		hasHydrated.current = true;
		hydrateFromServer().then((didHydrate) => {
			if (didHydrate) {
				// Force a re-render of the page to pick up the hydrated data
				window.dispatchEvent(new Event("appraisal-data-hydrated"));
			}
		});
	}, [session, status]);
}

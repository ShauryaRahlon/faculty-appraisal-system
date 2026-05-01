"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * SessionSync: Synchronizes the authenticated user's employeeCode
 * to localStorage as user_id, which is used for all FastAPI calls.
 *
 * employeeCode (e.g. "JIIT1068") is the stable identifier that links
 * auth (MongoDB users collection) with form data (form_data_collection).
 */
export function SessionSync() {
	const { data: session } = useSession();

	useEffect(() => {
		if (!session?.user) return;

		const user = session.user as {
			id?: string;
			employeeCode?: string;
		};

		// Use employeeCode as the user_id for FastAPI (matches MongoDB form_data_collection)
		const userId = user.employeeCode || user.id;
		if (userId && localStorage.getItem("user_id") !== userId) {
			localStorage.setItem("user_id", userId);
			console.log(
				"SessionSync: Updated user_id in localStorage →",
				userId
			);
		}
	}, [session]);

	return null;
}

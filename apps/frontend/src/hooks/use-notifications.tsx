"use client";

import {
	type PermissionStatus,
	PushNotifications
} from "@capacitor/push-notifications";
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useMemo
} from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

import { User } from "~/api/user";

import { useDevice } from "./use-device";
import { useSession } from "./use-session";

export interface NotificationContext {
	status: PermissionStatus["receive"];
	pushRegistrationId?: string;
}

const NotificationContext = createContext({} as NotificationContext);

export function NotificationProvider({ children }: PropsWithChildren) {
	const { platform, native } = useDevice();
	const [session] = useSession();
	const router = useRouter();

	const { data: status = "denied" } = useSWR(
		native && "notification-permissions",
		async () => {
			const { receive } = await PushNotifications.checkPermissions();
			if (receive === "prompt" || receive === "prompt-with-rationale") {
				const { receive } = await PushNotifications.requestPermissions();
				return receive;
			}

			return receive;
		}
	);

	const pushRegistrationId =
		(platform === "apple" && session?.user.apnsToken) ||
		(platform === "android" && session?.user.fcmToken) ||
		undefined;

	useSWR("notifications-reset-count", () => {
		if (
			!session?.user.id ||
			document.visibilityState === "hidden" ||
			!session.user.pushCount
		)
			return;
		return User.resetPushCount(session?.user.id);
	});

	useSWR(
		native && ["notifications-listeners", { status, pushRegistrationId }],
		async ([, { status, pushRegistrationId }]) => {
			if (status !== "granted") return;

			await PushNotifications.addListener(
				"registration",
				async ({ value: newPushRegistrationId }) => {
					if (
						!session ||
						session.sudoerId ||
						platform === "web" ||
						pushRegistrationId === newPushRegistrationId
					)
						return;

					await User.updatePushTokens(
						session.user.id,
						platform === "apple"
							? {
									apnsToken: newPushRegistrationId,
									fcmToken: session.user.fcmToken
								}
							: {
									apnsToken: session.user.apnsToken,
									fcmToken: newPushRegistrationId
								}
					);
					router.refresh();
				}
			);
		}
	);

	return (
		<NotificationContext.Provider
			value={useMemo<NotificationContext>(
				() => ({
					status,
					pushRegistrationId
				}),
				[status, pushRegistrationId]
			)}
		>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotifications() {
	return useContext(NotificationContext);
}

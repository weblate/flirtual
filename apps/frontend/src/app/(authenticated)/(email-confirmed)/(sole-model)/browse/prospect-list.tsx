"use client";

import { FC, useEffect } from "react";
import { RateApp } from "capacitor-rate-app";

import { ProspectKind } from "~/api/matchmaking";
import { User } from "~/api/user";
import { Profile } from "~/components/profile/profile";
import { useSession } from "~/hooks/use-session";
import { api } from "~/api";

import { OutOfProspects } from "./out-of-prospects";
import { DebuggerActions } from "./debugger-actions";
import { ProspectActions } from "./prospect-actions";

export interface ProspectListProps {
	current: User;
	next: User;
	kind: ProspectKind;
	likesLeft?: boolean;
	passesLeft?: boolean;
}

export const ProspectList: FC<ProspectListProps> = ({
	kind,
	current,
	next,
	likesLeft,
	passesLeft
}) => {
	const [session] = useSession();

	useEffect(() => {
		if (session?.user.createdAt) {
			const ratingPrompts = session.user.ratingPrompts;
			const monthsRegistered = Math.floor(
				(Date.now() - new Date(session.user.createdAt).getTime()) /
					2_592_000_000
			);

			if (
				(monthsRegistered >= 1 && ratingPrompts === 0) ||
				(monthsRegistered >= 3 && ratingPrompts === 1) ||
				(monthsRegistered >= 6 && ratingPrompts === 2)
			) {
				void RateApp.requestReview();
				void api.user.updateRatingPrompts(session.user.id, {
					body: {
						ratingPrompts:
							monthsRegistered >= 6 ? 3 : monthsRegistered >= 3 ? 2 : 1
					}
				});
			}
		}
	});

	if (!session) return null;

	return (
		<>
			{current ? (
				<>
					<div className="relative max-w-full">
						<Profile
							className=""
							id="current-profile"
							key={current.id}
							user={current}
						/>
						{next && (
							<Profile
								className="absolute hidden"
								id="next-profile"
								key={current.id + 1}
								user={next}
							/>
						)}
					</div>
					<ProspectActions
						kind={kind}
						likesLeft={likesLeft}
						passesLeft={passesLeft}
						prospect={current}
					/>
				</>
			) : (
				<OutOfProspects mode={kind} />
			)}
			<DebuggerActions session={session} />
		</>
	);
};

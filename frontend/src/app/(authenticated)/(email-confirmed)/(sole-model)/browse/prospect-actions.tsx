"use client";

import { ArrowUturnLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

import { api } from "~/api";
import { ProspectKind, ProspectRespondType, RespondProspectBody } from "~/api/matchmaking";
import { HeartIcon } from "~/components/icons/heart";
import { PeaceIcon } from "~/components/icons/peace";
import { Tooltip } from "~/components/tooltip";
import { useToast } from "~/hooks/use-toast";

export interface ProspectActionBarProps {
	userId: string;
	mode: ProspectKind;
}

export const ProspectActionBar: FC<ProspectActionBarProps> = ({ userId, mode }) => {
	const toasts = useToast();
	const router = useRouter();

	const [respondHistory, setRespondHistory] = useState<Array<RespondProspectBody>>([]);

	const respond = useCallback(
		async (type: ProspectRespondType, kind: ProspectKind) => {
			const body = {
				type,
				kind,
				mode: mode !== kind ? mode : undefined,
				userId
			};

			await api.matchmaking
				.respondProspect({ body })
				.then(() => {
					setRespondHistory((respondHistory) => [...respondHistory, body]);
					return router.refresh();
				})
				.catch(toasts.addError);
		},
		[userId, mode, router, toasts.addError]
	);

	const respondReverse = useCallback(async () => {
		setRespondHistory((respondHistory) => {
			const lastRespond = respondHistory.pop();
			if (!lastRespond) return [];

			void api.matchmaking
				.reverseRespondProspect({
					body: lastRespond
				})
				.then(() => router.refresh())
				.catch(toasts.addError);

			return respondHistory;
		});
	}, [router, toasts.addError]);

	return (
		<div className="h-32 w-full dark:bg-black-70 sm:h-0">
			<div className="pointer-events-none fixed bottom-0 left-0  flex  w-full items-center justify-center bg-gradient-to-b from-transparent to-black-90/50 p-8">
				<div className="pointer-events-auto flex h-32 items-center gap-3 overflow-hidden rounded-xl pb-16 text-white-10">
					<Tooltip value="Undo previous">
						<button
							className="flex h-fit items-center gap-3 rounded-xl bg-black-60 p-4 shadow-brand-1 disabled:cursor-not-allowed disabled:brightness-50"
							disabled={respondHistory.length === 0}
							type="button"
							onClick={respondReverse}
						>
							<ArrowUturnLeftIcon className="w-5" strokeWidth={3} />
						</button>
					</Tooltip>
					{mode === "love" && (
						<Tooltip value="Like profile">
							<button
								className="flex items-center justify-center gap-3 rounded-xl bg-brand-gradient px-6 py-4 shadow-brand-1 sm:w-40"
								type="button"
								onClick={() => respond("like", mode)}
							>
								<HeartIcon className="w-8 shrink-0" gradient={false} />
								<span className="hidden font-montserrat text-lg font-extrabold md:inline">
									Like
								</span>
							</button>
						</Tooltip>
					)}
					<Tooltip value="Friend profile">
						<button
							type="button"
							className={twMerge(
								"flex items-center justify-center gap-3 rounded-xl px-6 py-4 shadow-brand-1",
								mode === "friend" ? "w-40 bg-brand-gradient" : "bg-black-50"
							)}
							onClick={() => respond("like", "friend")}
						>
							<PeaceIcon className="w-8 shrink-0" gradient={false} />
							<span className="hidden font-montserrat text-lg font-extrabold md:inline">Homie</span>
						</button>
					</Tooltip>
					<Tooltip value="Pass profile">
						<button
							className="flex h-fit items-center gap-3 rounded-xl bg-black-60 p-4 shadow-brand-1"
							type="button"
							onClick={() => respond("pass", mode)}
						>
							<XMarkIcon className="w-5" strokeWidth={3} />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

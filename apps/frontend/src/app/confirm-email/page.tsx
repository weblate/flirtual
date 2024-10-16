import { redirect } from "next/navigation";

import { SoleModelLayout } from "~/components/layout/sole-model";
import { ModelCard } from "~/components/model-card";
import { withOptionalSession } from "~/server-utilities";
import { urls } from "~/urls";

import { UserForms } from "./user-forms";
import { ConfirmTokenForm } from "./confirm-token-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Confirm email"
};

export interface ConfirmEmailPageProps {
	searchParams?: { to?: string; token?: string };
}

export default async function ConfirmEmailPage({
	searchParams
}: ConfirmEmailPageProps) {
	const session = await withOptionalSession();

	if (session?.user.emailConfirmedAt && !searchParams?.token)
		redirect(searchParams?.to ?? urls.browse());

	if (!session?.user && !searchParams?.token)
		redirect(urls.login(searchParams?.to));

	return (
		<SoleModelLayout footer={{ desktopOnly: true }}>
			<ModelCard title="Confirm your email">
				{searchParams?.token ? (
					<ConfirmTokenForm token={searchParams.token} />
				) : (
					<UserForms user={session?.user} />
				)}
			</ModelCard>
		</SoleModelLayout>
	);
}

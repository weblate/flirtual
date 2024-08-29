import { redirect } from "next/navigation";

import { withOptionalSession } from "~/server-utilities";
import { urls } from "~/urls";

export async function GET() {
	const session = await withOptionalSession();

	if (session) redirect(urls.browse());
	redirect(urls.landing);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assert(condition: any, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

export const siteOrigin = process.env.NEXT_PUBLIC_ORIGIN as string;
assert(siteOrigin, "NEXT_PUBLIC_ORIGIN is required");

export const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
assert(apiUrl, "NEXT_PUBLIC_API_URL is required");

export const environment = (process.env.NEXT_PUBLIC_VERCEL_ENV ||
	process.env.NODE_ENV) as string;

export const gitOrganization = process.env
	.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER as string;
export const gitRepository = process.env
	.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG as string;
export const gitCommitSha =
	process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local";
export const gitCommitReference = process.env
	.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF as string;
export const gitCommitUrl = gitCommitSha
	? `https://github.com/${gitOrganization}/${gitRepository}/commit/${gitCommitSha}`
	: null;

export const turnstileSiteKey = process.env
	.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string;
export const talkjsAppId = process.env.NEXT_PUBLIC_TALKJS_APP_ID as string;
export const freshworksWidgetId = 73000002566;
export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN as string;
export const rcAppleKey = process.env.NEXT_PUBLIC_RC_APPL_PUBLIC_KEY as string;
export const rcGoogleKey = process.env.NEXT_PUBLIC_RC_GOOG_PUBLIC_KEY as string;

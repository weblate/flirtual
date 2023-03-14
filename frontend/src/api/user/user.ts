import { snakeCase } from "change-case";

import { DatedModel, UuidModel } from "../common";
import { fetch, NarrowFetchOptions } from "..";

import { Profile } from "./profile/profile";
import { Preferences } from "./preferences";
import { Subscription } from "./subscription";

export type UserTags = "admin" | "moderator" | "beta_tester" | "debugger" | "verified";

export type User = UuidModel &
	Partial<DatedModel> & {
		email: string;
		username: string;
		language?: string;
		talkjsSignature?: string;
		visible: boolean;
		bornAt?: string;
		activeAt?: string;
		emailConfirmedAt?: string;
		deactivatedAt?: string;
		preferences?: Preferences;
		profile: Profile;
		subscription?: Subscription;
		tags: Array<UserTags>;
	};

export async function create(
	options: NarrowFetchOptions<{
		username: string;
		email: string;
		password: string;
		notifications: boolean;
		serviceAgreement: boolean;
		captcha: string;
	}>
) {
	return fetch<User>("post", "users", options);
}

export async function get(userId: string, options: NarrowFetchOptions = {}) {
	return fetch<User>("get", `users/${userId}`, options);
}

export async function bulk(options: NarrowFetchOptions<Array<string>>) {
	return fetch<Array<User>>("post", "users/bulk", options);
}

export async function getByUsername(username: string, options: NarrowFetchOptions = {}) {
	return fetch<User>("get", `users/${username}/username`, options);
}

export interface UserVisibility {
	visible: boolean;
	reasons: Array<{
		reason: string;
		to?: string;
	}>;
}

export async function visible(userId: string, options: NarrowFetchOptions = {}) {
	return fetch<UserVisibility>("get", `users/${userId}/visible`, options);
}

export type UpdateUserBody = Partial<Pick<User, "bornAt" | "language">>;

export async function update(
	userId: string,
	options: NarrowFetchOptions<
		UpdateUserBody,
		| {
				required?: Array<keyof UpdateUserBody>;
		  }
		| undefined
	>
) {
	return fetch<User>("post", `users/${userId}`, {
		...options,
		query: {
			required: Array.isArray(options.query?.required)
				? options.query?.required.map((key) => snakeCase(key))
				: undefined
		}
	});
}

export async function updateEmail(
	userId: string,
	options: NarrowFetchOptions<{
		currentPassword: string;
		email: string;
		emailConfirmation: string;
	}>
) {
	return fetch<User>("post", `users/${userId}/email`, options);
}

export async function updatePassword(
	userId: string,
	options: NarrowFetchOptions<{
		currentPassword: string;
		password: string;
		passwordConfirmation: string;
	}>
) {
	return fetch<User>("post", `users/${userId}/password`, options);
}

export async function confirmEmail(options: NarrowFetchOptions<{ token: string }>) {
	return fetch<User>("post", `auth/email/confirm`, options);
}

export async function resendConfirmEmail(userId: string, options: NarrowFetchOptions = {}) {
	return fetch("delete", `auth/email/confirm`, options);
}

export async function deactivate(
	userId: string,
	options: NarrowFetchOptions<{
		currentPassword: string;
	}>
) {
	return fetch<User>("post", `users/${userId}/deactivate`, options);
}

export async function reactivate(userId: string, options: NarrowFetchOptions = {}) {
	return fetch<User>("delete", `users/${userId}/deactivate`, options);
}

export { _delete as delete };
async function _delete(
	options: NarrowFetchOptions<{
		reasonId: string;
		comment: string;
		currentPassword: string;
		captcha: string;
	}>
) {
	return fetch<User>("delete", `auth/user`, options);
}

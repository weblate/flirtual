import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { Dispatch, PropsWithChildren } from "react";

import { api } from "~/api";
import { displayName, User } from "~/api/user";
import { useAttributeList } from "~/hooks/use-attribute-list";
import { useToast } from "~/hooks/use-toast";
import { sortBy } from "~/utilities";

import { DrawerOrModal } from "../drawer-or-modal";
import { Form, FormButton } from "../forms";
import { InputLabel, InputSelect, InputTextArea } from "../inputs";

type BanProfileModalProps = PropsWithChildren<{
	user: User;
	visible: boolean;
	onVisibilityChange: Dispatch<boolean>;
}>;

export const BanProfileModal: React.FC<BanProfileModalProps> = ({
	user,
	children,
	visible,
	onVisibilityChange
}) => {
	const toasts = useToast();
	const reasons = sortBy(useAttributeList("ban-reason"), ({ metadata }) => metadata.order);

	return (
		<DrawerOrModal visible={visible} onVisibilityChange={onVisibilityChange}>
			<Form
				className="flex flex-col gap-8 rounded-3xl p-5 dark:text-white-20 sm:w-96"
				requireChange={false}
				fields={{
					targetId: user.id,
					reasonId: reasons[0]?.id,
					message: reasons[0]?.metadata.details
				}}
				onSubmit={async ({ targetId, ...body }) => {
					await api.user.suspend(targetId, { body });

					toasts.add({
						type: "success",
						label: `Successfully banned profile!`,
						children: <span className="text-sm">User: {user.id}</span>
					});

					onVisibilityChange(false);
				}}
			>
				{({ FormField, fields: { message } }) => (
					<>
						<FormField className="flex flex-row items-center gap-4" name="targetId">
							{() => (
								<>
									<ShieldExclamationIcon className="h-6 w-6" />
									<span className="text-xl">Ban profile: {displayName(user)}</span>
								</>
							)}
						</FormField>
						<FormField name="reasonId">
							{(field) => (
								<>
									<InputSelect
										{...field.props}
										options={reasons.map((attribute) => ({
											key: attribute.id,
											label: attribute.name
										}))}
										onChange={(reasonId) => {
											field.props.onChange(reasonId);
											message.props.onChange(
												reasons.find((reason) => reason.id === reasonId)?.metadata.details || ""
											);
										}}
									/>
								</>
							)}
						</FormField>
						<FormField name="message">
							{(field) => (
								<>
									<InputLabel {...field.labelProps}>Message</InputLabel>
									<InputTextArea
										{...field.props}
										placeholder="Write a custom ban reason for the user."
										rows={6}
									/>
								</>
							)}
						</FormField>
						<FormButton>Yonk</FormButton>
					</>
				)}
			</Form>
			{children}
		</DrawerOrModal>
	);
};

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

import {
	FormFieldsDefault,
	InputFormField,
	useFormContext
} from "~/hooks/use-input-form";

import { FormInputMessages } from "./input-messages";

export type FormFieldProps<
	K extends keyof T,
	T extends FormFieldsDefault
> = Omit<React.ComponentProps<"div">, "children"> & {
	name: K;
	children: (field: InputFormField<T, K>) => React.ReactNode;
};

export type FormFieldFC<T extends FormFieldsDefault> = <K extends keyof T>(
	props: FormFieldProps<K, T>
) => JSX.Element;

export function FormField<K extends keyof T, T extends FormFieldsDefault>({
	name,
	children,
	...props
}: FormFieldProps<K, T>) {
	const reference = useRef<HTMLDivElement>(null);
	const form = useFormContext<T>();
	const field = form.fields[name];

	const searchParameters = useSearchParams();
	const autofocus = searchParameters.get("af") === field.props.id;

	useEffect(() => {
		if (!autofocus) return;
		setTimeout(() => {
			if (!reference.current) return;
			reference.current.scrollIntoView();
			reference.current.focus();
		}, 1);
	}, [autofocus]);

	return (
		<div
			{...props}
			className={twMerge("flex flex-col gap-2", props.className)}
			ref={reference}
		>
			{children(field)}
			<FormInputMessages
				messages={field.errors.map((value) => ({ type: "error", value }))}
			/>
		</div>
	);
}

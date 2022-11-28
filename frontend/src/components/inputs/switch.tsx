"use client";

import { twMerge } from "tailwind-merge";

type SwitchInputProps = React.ComponentProps<"input"> & { label: string };

const SwitchInput: React.FC<SwitchInputProps> = ({ label, ...props }) => (
	<div className="relative flex h-10 w-14 items-center justify-center">
		<input
			{...props}
			type="radio"
			className={twMerge(
				"peer absolute h-full w-full rounded-none border-none bg-transparent checked:bg-brand-gradient focus:shadow-none focus:outline-none focus:ring-transparent focus:ring-offset-0",
				props.className
			)}
		/>
		<label
			className={twMerge(
				"pointer-events-none absolute",
				props.checked ? "text-white-20" : "text-black-80 dark:text-white-20"
			)}
		>
			{label}
		</label>
	</div>
);

export type SwitchValue = null | boolean;

export interface InputSwitchProps {
	value: SwitchValue;
	name: string;
	onChange: React.Dispatch<boolean>;
}

export const InputSwitch: React.FC<InputSwitchProps> = (props) => {
	const { value, name } = props;

	return (
		<div className="flex h-fit w-fit shrink-0 grow-0 overflow-hidden rounded-xl bg-white-30 shadow-brand-1 focus-within:ring-2 focus-within:ring-coral focus-within:ring-offset-2 focus-within:ring-offset-white-20 dark:bg-black-60 focus-within:dark:ring-offset-black-50">
			<SwitchInput
				checked={value === null ? false : value}
				label="Yes"
				name={name}
				value="yes"
				onChange={() => props.onChange(true)}
			/>
			<SwitchInput
				checked={value === null ? false : !value}
				label="No"
				name={name}
				value="no"
				onChange={() => props.onChange(false)}
			/>
		</div>
	);
};

import { PencilIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { IconComponent } from "../../icons";

export interface PillProps {
	Icon?: IconComponent;
	active?: boolean;
	href?: string;
	children: React.ReactNode;
	hocusable?: boolean;
}

export const Pill: React.FC<PillProps> = (props) => {
	const { Icon, active = false, hocusable = true, href, ...elementProps } = props;
	const Element = href ? Link : "div";
	const [hocused, setHocused] = useState(false);

	return (
		<AnimatePresence>
			<Element
				{...elementProps}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				href={href!}
				className={twMerge(
					"group pointer-events-auto relative flex h-8 select-none items-center gap-2 rounded-xl py-1 px-4 font-montserrat font-semibold shadow-brand-1",
					hocusable && (active || hocused)
						? "bg-brand-gradient text-white-10"
						: "bg-white-30 text-black-70 dark:bg-black-70 dark:text-white-20 sm:dark:bg-black-60"
				)}
				onBlur={() => setHocused(false)}
				onFocus={() => hocusable && setHocused(true)}
				onPointerEnter={() => hocusable && setHocused(true)}
				onPointerLeave={() => setHocused(false)}
			>
				{Icon && <Icon className="h-4" />}
				<motion.div
					animate={hocused ? { marginRight: "1.5rem" } : { marginRight: 0 }}
					className="flex items-center gap-2"
					initial={{ marginRight: 0 }}
					transition={{ type: "spring" }}
				>
					{props.children}
				</motion.div>
				{hocused && (
					<motion.div
						animate={{ opacity: 1 }}
						className="absolute right-0 pr-4"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						transition={{ type: "spring" }}
					>
						<PencilIcon className=" h-4 w-4" />
					</motion.div>
				)}
			</Element>
		</AnimatePresence>
	);
};

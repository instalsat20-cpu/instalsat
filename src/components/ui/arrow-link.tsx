"use client";

import { motion } from "framer-motion";
import { ArrowIcon } from "@/components/ui/arrow-icon";

const ease = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

type ArrowLinkProps = {
  text: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  className?: string;
};

/**
 * BT_03_ARROW — the site's underline text-link with a growing arrow on hover
 * (Figma: rest 262:1513, hover 262:1506). Text and underline go navy → orange,
 * and the arrow's tail grows out from the chevron.
 */
export function ArrowLink({ text, href, onClick, target, rel, className = "" }: ArrowLinkProps) {
  const content = (
    <>
      <span className="flex flex-col gap-2">
        <span className="whitespace-nowrap text-[15px] font-medium leading-none">{text}</span>
        <span className="h-px w-full bg-current" />
      </span>
      <span className="flex h-[14px] shrink-0 items-center">
        <ArrowIcon restColor="#003841" hoverColor="#E05829" />
      </span>
    </>
  );

  const sharedProps = {
    initial: "rest" as const,
    whileHover: "hover" as const,
    variants: { rest: { color: "#003841" }, hover: { color: "#E05829" } },
    transition: ease,
    className: `inline-flex w-fit cursor-pointer items-center gap-3 ${className}`,
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} {...sharedProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...sharedProps}>
      {content}
    </motion.button>
  );
}

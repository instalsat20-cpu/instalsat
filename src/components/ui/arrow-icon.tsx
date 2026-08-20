"use client";

import { motion } from "framer-motion";

const ease = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Brand arrow used in CTA buttons and ArrowLink. Blends between the two exact
 * brand SVGs (short rest arrow, long stretched hover arrow) driven by the
 * parent's "rest"/"hover" motion variants — opacity paired with a left-origin
 * scaleX so it reads as one arrow stretching, not a hard cut between two icons.
 */
export function ArrowIcon({ restColor = "#EEF5FF", hoverColor = "#EEF5FF", className = "" }: { restColor?: string; hoverColor?: string; className?: string }) {
  return (
    <span className={`relative inline-block h-[13px] w-[27px] shrink-0 ${className}`}>
      <motion.svg
        width="12" height="13" viewBox="0 0 12 13" fill="none"
        className="absolute inset-y-0 left-0 origin-left"
        variants={{ rest: { opacity: 1, scaleX: 1 }, hover: { opacity: 0, scaleX: 1.6 } }}
        transition={ease}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0.89258 5.20172L8.47391 5.20172L4.79597 1.52373C4.44695 1.17476 4.44695 0.609814 4.79597 0.261774C5.14494 -0.0872462 5.70984 -0.0872462 6.05793 0.261774L11.1068 5.31059C11.3201 5.52391 11.387 5.81753 11.338 6.09422C11.3871 6.37091 11.3201 6.66453 11.1059 6.87873L6.05704 11.9276C5.70807 12.2766 5.14312 12.2766 4.79503 11.9276C4.44606 11.5786 4.44606 11.0137 4.79503 10.6656L8.47391 6.98672L0.89258 6.98672C0.39992 6.98672 7.99906e-05 6.58688 8.00337e-05 6.09422C8.00767e-05 5.60156 0.39992 5.20172 0.89258 5.20172Z" fill={restColor} />
      </motion.svg>
      <motion.svg
        width="27" height="13" viewBox="0 0 27 13" fill="none"
        className="absolute inset-y-0 left-0 origin-left"
        variants={{ rest: { opacity: 0, scaleX: 0.55 }, hover: { opacity: 1, scaleX: 1 } }}
        transition={ease}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0.892487 5.20184L23.4738 5.20184L19.7959 1.52386C19.4469 1.17488 19.4469 0.609935 19.7959 0.261895C20.1448 -0.0871254 20.7097 -0.0871253 21.0578 0.261895L26.1067 5.31072C26.32 5.52403 26.3869 5.81766 26.3379 6.09434C26.387 6.37103 26.32 6.66466 26.1058 6.87886L21.0569 11.9277C20.708 12.2767 20.143 12.2767 19.7949 11.9277C19.446 11.5787 19.446 11.0138 19.7949 10.6657L23.4738 6.98684L0.892487 6.98684C0.399827 6.98684 -1.09543e-05 6.587 -1.09112e-05 6.09434C-1.08682e-05 5.60168 0.399827 5.20184 0.892487 5.20184Z" fill={hoverColor} />
      </motion.svg>
    </span>
  );
}

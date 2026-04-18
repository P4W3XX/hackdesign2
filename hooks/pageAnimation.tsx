"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageOpenAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      className="w-full h-full overflow-hidden bg-zinc-50"
      initial={{ opacity: 0, scale: 1.1, filter: "blur(3px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        scale: {
          type: "spring",
          damping: 20,
          stiffness: 300,
          restDelta: 0.001
        }
      }}
    >
      {children}
    </motion.div>
  );
}

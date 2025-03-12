"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

export default function ArtistPageClient({
  children
}: {
  children: ReactNode;
}) {
  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="flex-1 w-full pt-16 max-w-4xl mx-auto"
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={childVariants}
          // La première section (header) a un délai plus court pour un chargement plus rapide
          transition={{
            delay: Math.min(i * 0.1, 0.3),
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.main>
  );
}

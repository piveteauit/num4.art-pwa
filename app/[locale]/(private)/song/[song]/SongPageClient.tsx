"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePlayerMargin } from "@/hooks/usePlayerMargin";
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

// Composant spécifique pour l'image avec un effet hover
const ImageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={childVariants}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="relative w-[28svh] h-[28svh] mx-auto"
    >
      {children}
    </motion.div>
  );
};

export default function SongPageClient({ children }: { children: ReactNode }) {
  const { getMargin } = usePlayerMargin({ fromValue: 32 });
  // Identifier et wrap l'image avec le composant d'animation spécial
  const childrenArray = React.Children.toArray(children);
  const enhancedChildren = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      // Si c'est l'élément qui contient l'image (en se basant sur sa position ou sa classe)
      if (child.props?.className?.includes("relative w-[28svh] h-[28svh]")) {
        return <ImageContainer key={index}>{child}</ImageContainer>;
      }
    }
    return (
      <motion.div key={index} variants={childVariants}>
        {child}
      </motion.div>
    );
  });

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="bg-gradient-to-b relative from-neutral-900 to-base pt-16 w-full mx-auto flex-1"
      style={{ paddingBottom: getMargin() }}
    >
      {enhancedChildren}
    </motion.main>
  );
}

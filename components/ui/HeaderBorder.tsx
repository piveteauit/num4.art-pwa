"use client";

import { useState, useEffect, useRef } from "react";

export default function HeaderBorder({
  children
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScrolled(false);

      const section = document.querySelector("#scrollable-content") || document.querySelector("body");

      const handleScroll = () => {
        if (section) {
          setIsScrolled(section.scrollTop > 0);
        }
      };

      if (section) {
        section.addEventListener("scroll", handleScroll);
        return () => section.removeEventListener("scroll", handleScroll);
      }
      return () => clearTimeout(timer);
    }, 500);
  }, []);

  return (
    <header
      className={`mx-auto flex justify-between sticky w-full right-0 px-6 top-0 py-4 bg-base z-50 items-center transition-[border] duration-300 ease-in-out ${
        isScrolled ? "border-b border-white/10" : "border-b border-transparent"
      } bg-opacity-80 backdrop-blur-sm`}
    >
      {children}
    </header>
  );
}

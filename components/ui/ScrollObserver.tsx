"use client";
import React, { useRef, useEffect, useState } from "react";

const ScrollObserver = ({
  children,
  classes,
  threshold
}: {
  children: any;
  classes?: [string, string] | [string] | [];
  threshold?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  if (!classes) classes = ["visible", "invisible"];
  if (!classes?.[0]) classes[0] = "visible";
  if (!classes?.[1]) classes[1] = "invisible";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: typeof threshold === "number" ? threshold : 0.5 // Adjust as needed
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        classes?.[Number(!isVisible)]
      }`}
      ref={containerRef}
    >
      {children}
    </div>
  );
};

export default ScrollObserver;

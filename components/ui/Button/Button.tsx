"use client";
import { setCurrentMode } from "@/libs/server/user.action";
import { redirect, useRouter } from "@/navigation";
import React, { useEffect, useState } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

function Button(props: ButtonProps) {
  const { children, color, size } = props;

  return (
    <button
      {...props}
      className={`btn ${size ? "btn-" + size : ""} ${color ? "disabled:opacity-60 disabled:bg-" + color : "disabled:bg-inherit disabled:text-inherit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit disabled:hover:text-inherit disabled:pointer-events-auto "} ${color ? "btn-" + color : "btn-white"} text-custom ${props?.className}`}
    >
      {children}
    </button>
  );
}

export const ButtonChangeMode = ({
  id,
  artistMode,
  ...props
}: ButtonProps & any) => {
  const router = useRouter();

  return (
    <Button
      {...props}
      color="white" // Ajouté la couleur blanche en tant que propriété
      className={`text-white hover:bg-gray-100 hover:text-black focus:outline-none text-sm px-4 py-1 ${props.className}`}
      onClick={async (evt) => {
        await setCurrentMode({ id, artistMode });
        router.push({ pathname: "/dashboard", query: { artistMode } });
      }}
    />
  );
};

export default Button;

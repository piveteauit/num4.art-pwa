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
      className={`btn ${size ? "btn-" + size : ""} ${color ? "disabled:opacity-60 disabled:bg-" + color : "disabled:bg-primary disabled:opacity-60"} ${color ? "btn-" + color : "btn-white"} text-white ${props?.className}`}
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
      onClick={async (evt) => {
        await setCurrentMode({ id, artistMode });
        router.push({ pathname: "/dashboard", query: { artistMode } });
      }}
    />
  );
};

export default Button;

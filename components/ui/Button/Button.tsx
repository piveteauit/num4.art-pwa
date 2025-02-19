"use client";
import { setCurrentMode } from "@/libs/server/user.action";
import { redirect, useRouter } from "@/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
};

function Button(props: ButtonProps) {
  const { children, color, size, loading, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={loading || props.disabled}
      className={`btn ${size ? "btn-" + size : ""} ${
        color
          ? "disabled:opacity-60 disabled:bg-" + color
          : "disabled:bg-inherit disabled:text-inherit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit disabled:hover:text-inherit disabled:pointer-events-auto "
      } ${color ? "btn-" + color : "btn-white"} text-custom relative ${
        props?.className
      }`}
    >
      <span className={loading ? "invisible" : "visible"}>{children}</span>
      {loading && (
        <span className="loading loading-spinner loading-sm absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
      )}
    </button>
  );
}

export const ButtonChangeMode = ({
  id,
  artistMode,
  children,
  ...props
}: ButtonProps & any) => {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      {...props}
      color="white"
      loading={isLoading}
      className={`relative text-white hover:bg-gray-100 hover:text-black focus:outline-none text-sm px-4 py-1 ${props.className}`}
      onClick={async (evt) => {
        setIsLoading(true);
        await setCurrentMode({ id, artistMode });
        await update();
        router.push({ pathname: "/account", query: { artistMode } });
        setIsLoading(false);
      }}
    >
      {children}
    </Button>
  );
};

export default Button;

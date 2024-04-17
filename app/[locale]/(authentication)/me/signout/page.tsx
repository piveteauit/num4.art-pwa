"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

function SignoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return <div></div>;
}

export default SignoutPage;

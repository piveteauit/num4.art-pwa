"use client";
import { signIn } from "next-auth/react";
import Button from "../Button/Button";
import Input from "./Input/Input";
import { useState } from "react";
import { Link } from "@/navigation";
import { Provider } from "next-auth/providers";

interface ProviderLight {
  id: Provider["id"];
  name: Provider["name"];
  type: Provider["type"];
  style?: any;
}

function Login({ providers }: { providers: ProviderLight[] }) {
  const [email, setEmail] = useState("");
  const handleSignin = ({ id }: ProviderLight) => {
    if (id === "email") {
      localStorage.setItem("email", email);
      localStorage.setItem("callbackUrl", "/dashboard");
    }
    return signIn(id, { email, redirect: true, callbackUrl: "/dashboard" });
  };

  const providersArr = Object.values(providers);

  return (
    <section className="w-full">
      <Input
        type="email"
        autoComplete="email"
        name="email"
        value={email}
        label="email"
        onChange={({ target: { value } }: any) => setEmail(value)}
      />
      {providersArr.map((provider, i) => {
        return (
          <div key={provider.name} className="mb-4 mt-2">
            <Button
              className={`w-full ${i ? "bg-secondary border-none" : ""}`}
              onClick={() => handleSignin(provider)}
            >
              <span>Sign in with : {provider.name}</span>
              <img src={provider?.style?.logo} />
            </Button>

            <div
              className={`flex items-center my-3 ${providersArr?.length - 1 > providersArr?.indexOf(provider) ? "" : "hidden"}`}
            >
              <hr className="my-2 flex-1" />
              <span className="mx-2"> OU </span>
              <hr className="my-2 flex-1" />
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Login;

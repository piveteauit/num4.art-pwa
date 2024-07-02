"use client";
import Button from "../Button/Button";
import Input from "./Input/Input";
import { useState } from "react";
import { Link } from "@/navigation";
import apiClient from "@/libs/api";
import { signIn } from "next-auth/react";

function Register() {
  const [credentials, setCredentials] = useState({
    password: "",
    email: "",
    username: ""
  });

  const onSubmit = async (evt: any) => {
    evt.preventDefault();
    await apiClient.post("register", credentials);
    await signIn("credentials", {
      credentials,
      redirect: true,
      callbackUrl: "/"
    });
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <Input
        onChange={({ currentTarget: { value: email } }) =>
          setCredentials({ ...credentials, email })
        }
        value={credentials?.email}
        type="email"
        required
        label="Email"
      />

      <Input
        onChange={({ currentTarget: { value: username } }) =>
          setCredentials({ ...credentials, username })
        }
        value={credentials?.username}
        type="text"
        required
        label="Pseudo"
      />

      <Input
        onChange={({ currentTarget: { value: password } }) =>
          setCredentials({ ...credentials, password })
        }
        value={credentials?.password}
        type="password"
        required
        label="mot de passe"
      />

      <div className="flex flex-col gap-1 p-10 pt-5">
        <Button type="submit">Inscription </Button>

        <Button
          type="button"
          className="bg-secondary border-none"
          color="secondary"
          role="link"
        >
          <Link href={"/me/signin"}>connexion</Link>
        </Button>
      </div>
    </form>
  );
}

export default Register;

"use client";
import { getSession } from "next-auth/react";
import Button from "../Button/Button";
import Input from "./Input/Input";
import { useEffect, useState } from "react";
import { handleSignUp } from "@/libs/server/user.action";

function Welcome() {
  const [artistName, setArtistName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSession().then(({ user }) => setUser(user));
  }, []);

  return (
    <section className="w-full">
      <Input
        type="text"
        autoComplete="username"
        name="username"
        value={artistName}
        label="Nom d'artiste (si artiste)"
        onChange={({ target: { value } }: any) => setArtistName(value)}
      />

      <Button
        onClick={() => {
          handleSignUp({ artist: artistName, id: user?.id }).then(() => {
            document.location.href = "/dashboard";
          });
          // onSubmit({ artist: artistName, id: user?.id })
        }}
      >
        Valider
      </Button>
    </section>
  );
}

export default Welcome;

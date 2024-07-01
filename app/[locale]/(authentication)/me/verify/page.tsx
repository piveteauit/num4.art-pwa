"use client";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Form/Input/Input";
import apiClient from "@/libs/api";
import { redirect } from "@/navigation";
import { useEffect, useState } from "react";

function VerifyPage() {
  const [{ email, callbackUrl }, setEmailAndUrl] = useState({
    email: "",
    callbackUrl: ""
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (typeof localStorage === "undefined") return;

    setEmailAndUrl({
      email: encodeURIComponent(localStorage.getItem("email")),
      callbackUrl: localStorage.getItem("callbackUrl")
    });
  }, []);

  const getUrl = (token: string) => {
    return `/auth/callback/email?callbackUrl=${callbackUrl}&token=${token}&email=${email}`;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-custom-black">
      <section className="mx-auto max-w-xs self-center flex flex-col gap-8">
        <span>
          {" Entrez le code de vérification que vous avez reçu par email"}
        </span>
        <Input
          onChange={(evt: any) => {
            const token = evt.target.value;
            if (token?.length === 6) {
              apiClient
                .get(getUrl(token))
                .then((response) => {
                  localStorage.removeItem("email");
                  if (
                    response?.headers?.["x-middleware-rewrite"]?.includes(
                      callbackUrl
                    )
                  ) {
                    return (document.location.href = callbackUrl);
                  }

                  localStorage.removeItem("callbackUrl");

                  return (document.location.href =
                    callbackUrl || "/fr/me/welcome");
                })
                .catch((error) => {
                  setError("Email or token invalid");
                });
            }
          }}
          // label="token"
          type="text"
          minLength={6}
          maxLength={6}
          required
          name="token"
          
        />

        {!error ? null : (
          <>
            <div className=" alert alert-error">{error} </div>
          </>
        )}

        <Button> <span style={{ color: '#191919' }}>Valider</span> </Button>
      </section>
    </div>
  );
}

export default VerifyPage;

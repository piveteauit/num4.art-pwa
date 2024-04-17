"use client";

// import { useEffect } from "react";
// import Button from "./ui/Button/Button";

function Installer() {
  // useEffect(() => {
  //   if (!window || typeof window === "undefined") return;
  //   let installPrompt: any = null;
  //   const installButton = document?.querySelector("#install");

  //   window.addEventListener("beforeinstallprompt", (event) => {
  //     event.preventDefault();
  //     installPrompt = event;
  //     installButton.removeAttribute("hidden");
  //   });

  //   installButton?.addEventListener("click", async () => {
  //     if (!installPrompt) return;

  //     installPrompt?.prompt()
  //     installPrompt?.userChoice
  //       .then(console.log)
  //       .catch(console.error)
  //       .finally(disableInAppInstallPrompt);
  //   });

  //   function disableInAppInstallPrompt() {
  //     installPrompt = null;
  //     installButton.setAttribute("hidden", "");
  //     installButton.classList.add("hidden")
  //   }
  // }, [])

  return <></>;
  // return (
  //   <button
  //     className=" absolute top-[40%] m-auto  h-[80px] w-[150px] left-[calc(50%_-_75px)] bg-slate-500 rounded-xl text-center justify-center items-center flex flex-col"
  //     id="install"
  //     hidden >Install</button>
  // )
}

export default Installer;

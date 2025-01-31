"use client";
import { useState, useEffect } from "react";
import Login from "../Form/Login";
import VerifyModal from "./VerifyModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { getProviders } from "next-auth/react";
import type { ProviderType } from "@/types/auth";

export default function AuthModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showVerify, setShowVerify] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderType[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      if (providers) {
        setProviders(Object.values(providers));
      }
    };
    loadProviders();
  }, []);

  const handleLoginSuccess = async (email: string) => {
    try {
      setSlideOut(true);
      setTimeout(() => {
        setShowVerify(true);
      }, 300);
      toast.success("Code envoyé");
    } catch (error: any) {
      toast.error("Une erreur est survenue lors de l'envoi du code");
      console.error(error.message);
    }
  };

  const handleBack = () => {
    setShowVerify(false);
    setTimeout(() => {
      setSlideOut(false);
    }, 50);
  };

  const handleClose = () => {
    onClose();
    if (window.location.pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[99999]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-end md:items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full md:scale-95 opacity-0"
              enterTo="translate-y-0 md:scale-100 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 md:scale-100 opacity-100"
              leaveTo="translate-y-full md:scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full md:max-w-[600px] max-md:h-[70vh] bg-custom-black p-8 md:p-8 rounded-t-3xl md:rounded-lg relative overflow-hidden flex flex-col justify-center items-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-[999999]"
                >
                  ✕
                </button>

                {showVerify && (
                  <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 text-white hover:text-gray-300 z-[999999]"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div className="mb-8 flex justify-center">
                  <Image
                    alt="Logo n°4"
                    width={120}
                    height={40}
                    src="/assets/images/logos/Logo_num4_V2_blanc.png"
                  />
                </div>

                <div className="relative flex flex-col items-center w-full px-8">
                  <div
                    className={`transition-transform duration-300 ease-in-out ${
                      slideOut ? "translate-x-[-200%]" : "translate-x-0"
                    } w-full`}
                  >
                    <Login
                      providers={providers}
                      onSuccess={handleLoginSuccess}
                    />
                  </div>

                  <div
                    className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out ${
                      showVerify ? "translate-x-0" : "translate-x-[100%]"
                    }`}
                  >
                    {showVerify && (
                      <VerifyModal
                        isOpen={true}
                        onClose={onClose}
                        onSuccess={onClose}
                        isEmbedded={true}
                      />
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

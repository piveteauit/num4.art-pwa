import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/layout/LayoutClient";
import config from "@/config";
import "./globals.css";
import Provider from "@/context/Provider";
import Player from "@/components/Player/Player";
import Navbar from "@/components/ui/Navigation/Navbar";

const font = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: "#131313",
  width: "device-width",
  initialScale: 1
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = {
  ...getSEOTags(),
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale?: string };
}) {
  const messages: any = useMessages();

  return (
    <html
      lang={locale}
      data-theme={config.colors.theme}
      className={`${font.className} bg-base text-white`}
    >
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <NextIntlClientProvider locale={locale} messages={messages}>
        {/* TODO: change to h-dvh */}
        <body className="relative overflow-hidden">
          <Provider>
            <ClientLayout>
              {children}
              <Player />
              <Navbar />
            </ClientLayout>
          </Provider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}

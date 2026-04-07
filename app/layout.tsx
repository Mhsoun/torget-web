import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getCachedBusinessConfig } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCachedBusinessConfig();
  return {
    title: config.name,
    description: config.tagline ?? `${config.name} marketplace`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getCachedBusinessConfig();
  const defaultBrandKey = config.brandKey;

  return (
    <html lang={config.locale} suppressHydrationWarning>
      <head>
        {/*
          FOUC prevention: reads brand + mode from localStorage and applies
          data-brand attribute and .dark class before first paint.
          The default brand key is injected server-side from business config.
          suppressHydrationWarning on <html> prevents React mismatch warnings
          since this script mutates the element before hydration.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('torget-tenant')||localStorage.getItem('torget-brand')||'${defaultBrandKey}';document.documentElement.setAttribute('data-tenant',t);document.documentElement.setAttribute('data-brand',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

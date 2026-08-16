import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { LinkPreviewProvider } from "@/components/ui/LinkPreview";
import { Navigation } from "@/components/ui/Navigation";
import { env } from "@/env";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    template: "%s | Loc Tran",
    default: "Loc Tran - Full Stack Engineer & Software Architect",
  },
  description: "Personal portfolio and blog of Loc Tran",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const themeInitScript = `(function() {
  try {
    var theme = localStorage.getItem('portfolio-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={geistSans.variable} suppressHydrationWarning>
      <head>
        <script
          async
          suppressHydrationWarning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Theme initialization before paint to prevent FOUC
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <LinkPreviewProvider>
              <SmoothScrollProvider>
                <div className="min-h-screen flex flex-col bg-bg-base-1 text-text-primary">
                  <Header />
                  <div className="flex-1 w-full max-w-300 mx-auto px-5 md:px-10 lg:px-20 py-8 md:py-12 flex flex-col min-[810px]:flex-row min-[810px]:items-start gap-10 md:gap-14">
                    <Navigation />
                    <div className="flex-1 min-w-0">{children}</div>
                  </div>
                  <Footer />
                </div>
              </SmoothScrollProvider>
            </LinkPreviewProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

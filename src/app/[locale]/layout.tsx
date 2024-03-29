import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "@/theme/ThemeProvider";
import supabase from '@/supabase/server';
import AuthProvider from "@/modules/auth/Provider";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  let messages;
  try {
    messages = (await import(`../../i18n/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html lang={locale}>
      <head>
        <title>{process.env.APP_NAME}</title>
      </head>
      <body style={{margin:0}}>
        <Suspense>

          <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider accessToken={session?.access_token}>

          <ThemeProvider>
            {children}
          </ThemeProvider>
          </AuthProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}

// import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./navigation";
import createIntlMiddleware from "next-intl/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: "as-needed",
  defaultLocale: "en",
});

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (req.nextUrl.pathname === `/${req.nextUrl.pathname.split('/')[1]}/auth`) {
    return NextResponse.redirect(`${req.url}/signin`);
  }
  console.log(user)
  if (!user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(`${req.url}auth/signin`);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

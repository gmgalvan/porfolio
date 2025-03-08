import { NextResponse, NextRequest } from 'next/server';

export const supportedLocales = ['en', 'es'];
export const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  // Get pathname from the request
  const { pathname } = request.nextUrl;
  
  // Check if the pathname already contains a locale
  const isPathMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  
  // Redirect if there is no locale in the pathname
  if (isPathMissingLocale) {
    // We use `defaultLocale` directly for simplicity here
    const locale = defaultLocale;
    
    // Create the new URL for the redirect
    const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    
    // Return a redirect response
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    '/((?!_next|api|favicon.ico).*)',
    // Force match on /
    '/',
  ],
};

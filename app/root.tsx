import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

import type { Route } from "./+types/root";
import "./app.css";
import i18next, { setI18nLanguage } from "./i18n/i18n";
import {
  getDocumentDirection,
  getLanguageFromPathname,
  type SupportedLanguage,
} from "./i18n/config";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const language = getLanguageFromPathname(pathname);
  const dir = getDocumentDirection(language);

  useEffect(() => {
    setI18nLanguage(language);
  }, [language]);

  return (
    <html lang={language} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <Outlet />
    </I18nextProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  const language = getLanguageFromPathname(pathname) as SupportedLanguage;
  const { t } = useTranslation("common");
  useEffect(() => {
    setI18nLanguage(language);
  }, [language]);

  let message = t("errors.oops");
  let details = t("errors.unexpected");
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : t("errors.error");
    details =
      error.status === 404
        ? t("errors.notFound")
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16 text-white">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

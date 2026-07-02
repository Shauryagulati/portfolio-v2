import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "@fontsource/commit-mono/400.css";
import "@fontsource/commit-mono/700.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "~/styles/tokens.css";
import "~/styles/base.css";
import "~/styles/site.css";

import { themeBootScript } from "~/lib/theme";

export function Layout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: data-theme is set pre-hydration by the boot script
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
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
  return <Outlet />;
}

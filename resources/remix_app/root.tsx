import {Links, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react'

export function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" color-mode="user">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* simple styling via MVP.css */}
        <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
        <link rel="stylesheet" href="/resources/remix_app/mvp-css-override.css" />
        {/* fonts */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* these are from Remix */}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )}

export default function App() {
  return <Outlet />}

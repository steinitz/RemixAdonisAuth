import {Links, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react'
import type {ReactNode} from 'react';
// import '/mvp-css-override.css'
// import '/styles.css'

export function Layout({children}: {children: ReactNode}) {
  return (
    <html lang="en" color-mode="user">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* simple styling via MVP.css - element styles only, no classes*/}
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/mvp.css" />
      {/*
      not needed now that the stylesheet lives in /public
      and also fixes a mysterious CSS MIME error
      <link rel="stylesheet" type="text/css" href="/public/mvp-css-override.css" />
      */}

      {/* additional styles including classes*/}
      {/*
      not needed now that the stylesheet lives in /public
      and also fixes a mysterious CSS MIME error
      <link rel="stylesheet" type="text/css" href="/public/styles.css" />
      */}

      {/* fonts */}
      <link
        rel="stylesheet"
        type="text/css"
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
  )
}

export default function App() {
  return <Outlet />
}

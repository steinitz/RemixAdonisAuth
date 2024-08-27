// Allows the user to request a password reset email
import mail from '@adonisjs/mail/services/main'
// import string from '@adonisjs/core/helpers/string'

import {
  ActionFunctionArgs,
  LoaderFunctionArgs, json,
  redirect} from '@remix-run/node'
import {
  // useActionData,
  // useLoaderData,
  isRouteErrorResponse, useRouteError, Form
  // Link
} from "@remix-run/react";
// import * as sea from "node:sea";

export const loader = ({ context }: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

const companyName:string = 'Blockchain Portfolio'

const getDomainURL = (request: any): string => {
  const host =
    request.headers().host

  if (!host) {
    throw new Error('Could not determine domain URL.')
  }

  const protocol =
    host.includes('localhost') || host.includes('127.0.0.1')
      ? 'http'
      : 'https'
  return `${protocol}://${host}`
}

export const action = async ({ context }: ActionFunctionArgs) => {
  const {
    http,
    make,
  } = context
  // get email form data
  const {email} = http.request.only(['email'])

  const userService = await make('user_service')
  let token
  try {
    token = await userService.setPasswordResetTokenFor(email)
  }
  catch (error) {
    console.warn(error)
  }

  const passwordResetUrl = `${getDomainURL(http.request)}/reset-password?token=${token}`

  await mail.send((message) => {
    message
      .to(email)
      // .from('info@example.org')
      .subject(`Reset Your ${companyName} Password\n\n`)
      // .htmlView('emails/verify_email', { user })
      // HTML contents
      .html(`
        <p>We understand that you’ve requested to reset your password for your ${companyName} account.</>

        <p>Click this link to reset your password page: ${passwordResetUrl}</p>

      `)

      // Plain text contents
      .text(`
        We understand that you’ve requested to reset your password for your ${companyName} account.

        Click this link to reset your password page: ${passwordResetUrl}

      `)
    }
  )

  return redirect(`/reset-password-email-sent?email=${email}`)
}

export default function Page() {
  // const data = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()
  return (
    <main>
      <section> {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{ textAlign: "center" }}>Forgot Password</h1>
          <p>
            Enter the email address associated with your account.
            <br />
            We'll send an email with a link to reset your password.
          </p>
          <label>
            Email
            <input type="text" name="email" />
          </label>
          <div style={{ textAlign: "right" }}>
            <button type="submit">Send me a reset email</button>
          </div>
        </Form>
      </section>
    </main>

  )
}

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

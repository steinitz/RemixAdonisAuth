import mail from '@adonisjs/mail/services/main'
import {
  // ActionFunctionArgs,
  LoaderFunctionArgs, json } from '@remix-run/node'
import {
  // useActionData,
  // useLoaderData,
  isRouteErrorResponse, useRouteError, Form,
  // Link
} from "@remix-run/react";

export const loader = ({ context }: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = (/*{ context }: ActionFunctionArgs*/) => {
  // const { http, make } = context
  console.log('reset_password - action method')
    // await
    mail.send((message) => {
      message
        // .to(user.email)
        .to('steve@stzdev.com')  ////
        // .from('info@example.org')
        .subject('Verify your email address')
        // .htmlView('emails/verify_email', { user })
        // HTML contents
        .html(`
          <h1> Verify email address </h1>
          <p> <a href="https://myapp.com">Click here</a> to verify your email address </a>
        `)

        // Plain text contents
        .text(`
          Verify email address
          Please visit https://myapp.com to verify your email address
        `)
    })
  return null
}

export default function Page() {
  // const data = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()
  return (
    <main>
      <section> {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{ textAlign: "center" }}>Reset Password</h1>
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

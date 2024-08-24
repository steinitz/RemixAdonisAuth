// Confirms to the user that the app has sent a reset-password email

import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import {
  Form,
  // useActionData, useLoaderData,
  isRouteErrorResponse, useRouteError, useSearchParams
} from "@remix-run/react";

export const loader = ({ context }: LoaderFunctionArgs) => {
  const { http, make } = context
  console.log(http, make)
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = ({ context }: ActionFunctionArgs) => {
  const { http, make } = context
  console.log(http, make)
  return null
}

export default function Page() {
  // const data = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  return (
    <main>
      <section>
        <Form>
          <h1>Email Sent</h1>
          <p>We have sent you an email at {email}.</p>
          <p>Check your inbox and follow the instructions to reset password</p>

          <h3>Didn't receive the mail?</h3>Resend Email
          <h3>Wrong Email Address?</h3>Change Email Address
          <div style={{ textAlign: "right" }}>
            <button type="submit">Done</button>
          </div>
        </Form>
      </section>
    </main>
  );
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

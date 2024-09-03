// Allows the user to request a password reset email
// import string from '@adonisjs/core/helpers/string'
import Spinner from "#components/Spinner";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { sendPasswordResetEmail } from "~/utilities/sendPasswordResetEmail";
import { useState } from "react";
import { getDomainUrl } from "~/utilities/getDomainUrl";
import { noValue } from "~/constants";
// import * as sea from "node:sea";

export const loader = ({params}: LoaderFunctionArgs) => {
  const email = params.email
  return json({
    email,
  })
}

export const action = async ({ context }: ActionFunctionArgs) => {
  const {
    http,
    make,
  } = context
  // get email from form data
  const {email} = http.request.only(['email'])

  return await sendPasswordResetEmail(
    email,
    getDomainUrl(http.request),
    await make("user_service")
  )
}

export default function Page() {
  const { email } = useLoaderData<typeof loader>()

  // hack to show the spinner as soon as the user hits the submit button
  const [didSubmit, setDidSubmit] = useState<boolean>(false)
  const onSubmit = () => {
    // console.log('onSubmit running')
    setDidSubmit(true)
  }

  return (
    <main>
      <section> {/* gives a nice width */}
        <Form method="post">
          <h1 style={{ textAlign: "center" }}>Forgot Password</h1>
          <p>
            Enter the email address associated with your account.
            <br />
            We'll send an email with a link to reset your password.
          </p>
          <label>
            Email
            <input type="text" name="email" defaultValue={email !== noValue ? email : ''} />
          </label>
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          {
            didSubmit ?
            <div style={{paddingTop: '13px'}}><Spinner/></div> :
            <div />
          }
          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              onClick={onSubmit}
            >
              Send me a reset email
            </button>
          </div>
          </div>
          <br />
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

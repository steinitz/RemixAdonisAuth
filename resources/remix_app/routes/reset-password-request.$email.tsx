// Allows the user to request a password reset email
import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import {sendPasswordResetEmail} from "~/emails/sendPasswordResetEmail";
import {getDomainUrl} from "~/utilities/getDomainUrl";
import {noValue} from "~/constants";
import {createPasswordResetValidationSchema} from "#validators/authenticationValidation";
import {ValidatedInput} from "~/components/ValidatedInput";
// import * as sea from "node:sea";

export const loader = ({params}: LoaderFunctionArgs) => {
  const email = params.email
  return json({
    email,
  })
}

const validationSchema = createPasswordResetValidationSchema()
export const action = async ({context}: ActionFunctionArgs) => {
  const {
    http,
    make,
  } = context
  // get email from form data
  const {email} = http.request.only(['email'])

  // validate the email
  let validationErrors
  try {
    // vine can sanitize what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({email});
  }
  catch (error) {
    validationErrors = error.messages
    console.log({validationErrors})
    // early return if validation errors
    return json({
      validationErrors,
    })
  }

  // send the password reset email
  sendPasswordResetEmail(
    email,
    getDomainUrl(http.request),
    await make("user_service")
  )
  return redirect(`/reset-password-email-sent?email=${email}`)
}

export default function Page() {
  const {email} = useLoaderData<typeof loader>()
  const {validationErrors} = useActionData<typeof action>() ?? []

  return (
    <main>
      <section> {/* gives a nice width */}
        <Form method="post">
          <h1 style={{textAlign: "center"}}>Forgot Password</h1>
          <p>
            Enter the email address associated with your account.
            <br />
            We'll send an email with a link to reset your password.
          </p>
          <label>
            Email
            <ValidatedInput
              fieldName='email'
              validationErrors={validationErrors}
              defaultValue={ email !== noValue ? email : '' }
            />
          </label>
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
            {/* this first div was a spinner but it was too hard to make it */}
            {/* appear/disappear reactively and avoiding infinite renders */}
            <div />
            <div style={{textAlign: "right"}}>
              <button type="submit">Send me a reset email</button>
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

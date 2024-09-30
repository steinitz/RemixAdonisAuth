// initial version generated via cli with:
// node ace remix:route --action --error-boundary login

import {
  ActionFunctionArgs, json,
  redirect
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useRouteError
} from '@remix-run/react'
import {noValue} from '~/constants'
import {PasswordField} from "~/components/PasswordField";
import {createLoginValidationSchema} from "#validators/authenticationValidation";
import {ValidatedInput} from "#remix_app/components/ValidatedInput";

const validationSchema = createLoginValidationSchema()

// called on form submission
export const action = async ({context}: ActionFunctionArgs) => {
  const {http, make} = context

  // get email and password from the form submission
  const {email, password} = http.request.only(['email', 'password'])

  let validationErrors
  try {
    // vine can sanitize what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({email, password});
  }
  catch (error) {
    validationErrors = error.messages
    console.log({validationErrors})
  }

  let loginError
  // look up the user by email
  // return an error message if not found
  let user
  const userService = await make('user_service')
  try {
    user = await userService.getUser(email);
  }
  catch (error) {
    // return json({
    //   error: "email not found",
    //})
    loginError = 'email not found'
  }

  // check if the password is correct
  // if not, return an error message

  let verifyPasswordResult
  if (!loginError && user) {
    verifyPasswordResult = await userService.verifyPassword(user, password);

    if (verifyPasswordResult === true) {
     // credentials ok so log in user
      await http.auth.use('web').login(user)
    }
    else {
      // throw new Error('Invalid credentials')
      loginError = "invalid credentials";
    }
  }

  const returnValue = validationErrors || loginError ?
    json({
      validationErrors,
      loginError
    }) :
    redirect(`/home`)

  return returnValue}

export default function Page() {
  const actionData = useActionData<typeof action>()
  const {
    // @ts-ignore
    loginError,
    // @ts-ignore
    validationErrors
  } = actionData ?? {}

  return (
    <main>
      <section> {/* gives it a nice width */}

        <Form method="post">
          <h1 style={{textAlign: "center"}}>Log in</h1>
          <label>
            Email
            <ValidatedInput
              fieldName='email'
              validationErrors={validationErrors}
            />
          </label>
          {PasswordField({})}
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <p style={{color: "var(--color-error)"}}>
              {loginError ?? ' '}
            </p>
            <button type="submit">Login</button>
          </div>
          <details>
            <summary>Can't log in?</summary>
            <p>Don't yet have an account? <Link to="/register">Register</Link></p>
            <p>Forgot Password?
              <Link to={`/reset-password-request/${noValue}`}>
                Reset Password
              </Link></p>
            <p>Get Help <Link to="/contact">Contact Support</Link></p>
          </details>
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
  }}

// The link in the pasword-reset email takes the user here

import {
  Link, useActionData, useLoaderData, useNavigate
} from "@remix-run/react";

import {
  LoaderFunctionArgs, json, ActionFunctionArgs, redirect} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";
import {PasswordInput} from "~/components/InputFields";
import {createNewPasswordValidationSchema} from "#validators/authenticationValidation";

export const loader = async ({context, params}: LoaderFunctionArgs) => {
  const {
    // http,
    make
  } = context
  const token = params.token
  const userService = await make('user_service')
  const {user, tokenHasExpired} = await userService.getUserWithPasswordResetToken(token || '')
  return json({user, tokenHasExpired})
}

const validationSchema = createNewPasswordValidationSchema()
export const action = async ({context, params}: ActionFunctionArgs) => {
  const {make, http} = context
  const token = params.token
  const {password} = http.request.only(['password'])

  let validationErrors
  try {
    // vine.validate returns sanitized versions of what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({password});
  }
  catch (error) {
    console.log({error})
    validationErrors = error.messages
    console.log({validationErrors})
  }

  // if no validation errors update the password
  const userService = await make('user_service')
  try {
    const {user} = await userService.getUserWithPasswordResetToken(token || '')
    user && userService.updatePassword(user, password)
  }
  catch (error) {
    throw error
  }

  const returnValue = validationErrors ?
    json({validationErrors}) :
    redirect(`/login`)

  return returnValue
}

export default function Page() {
  const {tokenHasExpired, user} = useLoaderData<typeof loader>()
  const {validationErrors} = useActionData<typeof action>() ?? []
  const navigate = useNavigate()

  return(
    <main>
      <section> {/* gives it a nice width */}
        <Form method="post">
          {
            tokenHasExpired || !user ?
            (<>
              <h1 style={{textAlign: "center"}}>
                {!user ?
                  "Something went wrong, can't reset password" :
                  'Reset-password link has expired'
                }
              </h1>
              <p>You can request another password-reset from the Login page</p>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <button onClick={() => navigate(`/contact`)}>Contact Support</button>
                <button onClick={() => navigate(`/login`)}>Login Page</button>
              </div>
            </>) :
            (<>
              <h1 style={{textAlign: "center"}}>
                Set new password
              </h1>
              <PasswordInput validationErrors={validationErrors} />
              <div style={{textAlign: "right"}}>
                <button type="submit">Set password</button>
              </div>
            </>)
          }
      </Form>
    </section>
  </main>
  )
}

const errorStringUserNotDefined = 'User is not defined'

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();
  let result;
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
    if (error.message.includes(errorStringUserNotDefined)) {
      result = (
        <main>
          <section>
            <Form>
              <h1>Error</h1>
              <p>No valid password-reset token found</p>
              <p>Please initiate a password-reset request in the Login page</p>
              <Link to="/login">Login</Link>
            </Form>
          </section>
        </main>

      )
     }
      else {
        result = (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      )
    }
  }
  else {
    result = (<h1>Unknown Error</h1>);
  }
  return result;
}

import {
  Link,
} from "@remix-run/react";
// The link in the pasword-reset email takes the user here

import {
  LoaderFunctionArgs, json
} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";
import { PasswordField } from "~/components/PasswordField";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const {
    // http,
    make
  } = context
  const token = params.token
  console.log('reset-password loader', { token})

  const userService = await make('user_service')
  let user
  try {
    user = userService.getUserWithPasswordResetToken(token)
  }
  catch (error) {
    throw error
  }
  return json({user})
}

export const action = () => {
  console.log('reset-password action')
  return null
}

export default function Page() {
  return(  <main>
      <section > {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{textAlign: "center"}}>Set new password</h1>
          {PasswordField()}
          <div style={{textAlign: "right"}}><button type="submit">Set password</button></div>
        </Form>
      </section>
    </main>
)}

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
    //// console.log(error)
    if (error.message.includes('User is not defined')) {
      result = (
        <main>
          <section>
            <Form>
              <h1>Error</h1>
              <p>No valid password reset token found</p>
              <p>Please initiate a password reset request in the Login page</p>
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
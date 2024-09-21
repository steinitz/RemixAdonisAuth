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
import { noValue } from '~/constants'

// called on form submission
export const action = async ({ context }: ActionFunctionArgs) => {
  const { http, make } = context

  // get email and password from the form submission
  const { email, password } = http.request.only(['email', 'password'])

  // look up the user by email
  // return an error message if not found
  let user
  const userService = await make('user_service')
  try {
    user = await userService.getUser(email);
  }
  catch (error) {
    return json({
      error: "email not found",
    })
  }

  // check if the password is correct
  // if not, return an error message
  const verifyPasswordResult =  await userService.verifyPassword(user, password)
  if (verifyPasswordResult === false) {
    // throw new Error('Invalid credentials')
    return json({
      error: 'incorrect password'
    })
  }

  // credentials ok so log in user
  await http.auth.use('web').login(user)

  return redirect('/home')
}

export default function Page() {
  const actionData = useActionData<typeof action>()
  console.log({actionData})
  return (
    <main>
      <section> {/* gives it a nice width */}

        <Form method="post">
          <h1 style={{ textAlign: "center" }}>Log in</h1>
          <label>
            Email
            <input type="text" name="email" />
          </label>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <p style={{color: "var(--color-error)"}}>{actionData?.error ? actionData?.error : ' '}</p>
            <button type="submit">Login</button>
          </div>
          <details>
            <summary>Can't log in?</summary>
            <p>Don't yet have an account? <Link to="/register">Register</Link></p>
            <p>Forgot Password? <Link to={`/reset-password-request/${noValue}`}>Reset Password</Link></p>
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
  }
}

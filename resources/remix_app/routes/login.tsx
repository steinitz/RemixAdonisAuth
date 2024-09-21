// initial version generated via cli: node ace remix:route --action --error-boundary login

import {
  ActionFunctionArgs,
  redirect
} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  Link,
  useRouteError
} from '@remix-run/react'
import { noValue } from '~/constants'

// called on form submission
export const action = async ({ context }: ActionFunctionArgs) => {
  const { http, make } = context

  // get email and password from the form submission
  const { email, password } = http.request.only(['email', 'password'])

  // look up the user by email
  const userService = await make('user_service')
  const user = await userService.getUser(email)

  // check if the password is correct
  const verifyPasswordResult =  await userService.verifyPassword(user, password)
  if (verifyPasswordResult === false) {
    throw new Error('Invalid credentials')
  }

  // log in user since they passed the check
  await http.auth.use('web').login(user)

  return redirect('/home')
}

export default function Page() {
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
          <div style={{ textAlign: "right" }}>
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

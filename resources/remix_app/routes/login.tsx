// generated via cli: node ace remix:route --action --error-boundary register
// warnings commented out by SJS

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  isRouteErrorResponse,
  Link,
  useRouteError
} from '@remix-run/react'
import { noEmailValue } from '~/constants'

export const loader = ({ context }: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = async ({ context }: ActionFunctionArgs) => {
  console.log('login action', {context})
  const { http, make } = context
  // get the form email and password
  const { email, password } = http.request.only(['email', 'password'])

  const userService = await make('user_service')
  // look up the user by email
  const user = await userService.getUser(email)

  console.log('login action', {user})
  // check if the password is correct
  await userService.verifyPassword(user, password)

  // log in user since they passed the check
  await http.auth.use('web').login(user)

  return redirect('/')
}

export default function Page() {
  // const data =
  useLoaderData<typeof loader>()

  // without the next line, form submission doesn't trigger the action function
  useActionData<typeof action>()

  return (
    <main>
      <section > {/* gives it a nice width */}
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
            <p>Forgot Password? <Link to={`/reset-password-request/${noEmailValue}`}>Reset Password</Link></p>
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

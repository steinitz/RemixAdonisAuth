import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useActionData, useLoaderData, isRouteErrorResponse, useRouteError } from '@remix-run/react'

export const loader = ({ context }: LoaderFunctionArgs) => {
  const { http, make } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = ({ context }: ActionFunctionArgs) => {
  const { http, make } = context
  return null
}

export default function Page() {
  // const data = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()
  // return <div>New route</div>
  return (
    <main>
        <header>
          <h2>Log in</h2>
        </header>  
        <section >
          <form method="post">
            <label>
              Email
              <input type="email" name="email" />
            </label>
            <label>
              Password
              <input type="password" name="password" />
            </label>
            <button type="submit">Login</button>
            <p>
              Don't have an account yet? <a href="/register">Register</a>
            </p>
          </form>
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
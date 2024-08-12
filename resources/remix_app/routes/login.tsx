// generated via cli: node ace remix:route --action --error-boundary register
// warnings commented out by SJS

import { 
  // ActionFunctionArgs, 
  LoaderFunctionArgs, 
  json 
} from '@remix-run/node'
import { 
  Form,
  // useActionData, 
  // useLoaderData, 
  isRouteErrorResponse, 
  Link, 
  useRouteError 
} from '@remix-run/react'

export const loader = ({ context }: LoaderFunctionArgs) => {
  const { 
    http, 
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = (/*{ context }: ActionFunctionArgs*/) => {
  // const { http, make } = context
  return null
}

export default function Page() {
  // const data = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()
  // return <div>New route</div>
  return (
    <main>
         <section > {/* gives it a nice width */}
          <Form method="post">
            <h1 style={{textAlign: "center"}}>Log in</h1>
            <label>
              Email
              <input type="text" name="email" />
            </label>
            <label>
              Password
              <input type="password" name="password"/>
            </label>
            <div style={{textAlign: "right"}}><button type="submit">Login</button></div>
            <p>
              Don't have an account yet? <Link to="/register">Register</Link>
            </p>
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
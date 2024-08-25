import {
  useLoaderData,
  // useRouteLoaderData,
} from "@remix-run/react"
// The link in the pasword-reset email takes the user here

import {
  // ActionFunctionArgs,
  LoaderFunctionArgs, json
} from '@remix-run/node'
import {
  Form,
  // useActionData,
  // useLoaderData,
  isRouteErrorResponse,
  // Link,
  useRouteError
} from "@remix-run/react";
import { PasswordField } from "~/components/PasswordField";

export const loader = ({ context, params }: LoaderFunctionArgs) => {
  const {
    // http,
    // make
  } = context
  console.log('reset-password loader', { token: params.token})
  // return json({
  //   message: 'Hello from ' + http.request.completeUrl(),
  // })
  return json({token: params.token})
}

export const action = (/*{ context }: ActionFunctionArgs*/) => {
  // const { http, make } = context
  console.log('reset-password action')
  return null
}

export default function Page() {

  const {token} = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()
  console.log(token)
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

import {
  // ActionFunctionArgs,
  LoaderFunctionArgs,
  json} from '@remix-run/node'
import {
  // useActionData,
  useLoaderData, isRouteErrorResponse, useRouteError, Form} from "@remix-run/react";

export const loader = async ({context}: LoaderFunctionArgs) => {
  const email = context.http.auth.user?.email
  console.log("index loader", {email})

  return json({
    email,
  })}

export const action = (/*{context}: ActionFunctionArgs*/) => {
  // const {http, make} = context
  return null}

export default function Page() {
  const {email} = useLoaderData<typeof loader>()
  console.log('index page', {email})
  return (
    <main>
      <nav>
        <h3>Blockchain Portfolio</h3>
        <span><p>Logged in as: {email}</p></span>
        <Form style={{border: 'none', boxShadow: 'none'}} method="POST">
          <input type="hidden" name="intent" value={'log_out'} />
          <button type={'submit'}>Log out</button>
        </Form>
      </nav>

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
  }}

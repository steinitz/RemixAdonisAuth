import Spinner from "#remix_app/components/Spinner";
import {
  isRouteErrorResponse, useRouteError, Form
} from "@remix-run/react";

/*
import {
  LoaderFunctionArgs,
  json
} from '@remix-run/node'
import {
  useLoaderData, isRouteErrorResponse, useRouteError, Form
} from "@remix-run/react";
import {
  getAuthenticatedUser
} from "#remix_app/utilities/adonisHelpers";
*/

/*
export const loader = async ({context}: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(context);

  // I would prefer not to have to use snake for the attributes.
  // But how?  Something with the UserService?
  const {email} = user

  console.log("index loader", {email})

  return json({
    email,
  })
}
*/

export const action = (/*{context}: ActionFunctionArgs*/) => {
  // const {http, make} = context
  return null}

export default function Page() {
  return (
    <main>
      <nav>
        <h3>Blockchain Portfolio</h3>
        <Form style={{border: 'none', boxShadow: 'none'}} method="POST">
          <input type="hidden" name="intent" value={'log_out'} />
          <button type={'submit'}>Log out</button>
        </Form>
      </nav>
      <Spinner />

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

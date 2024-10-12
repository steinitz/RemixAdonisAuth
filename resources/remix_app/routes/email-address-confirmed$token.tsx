import {ActionFunctionArgs, LoaderFunctionArgs, json} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";

export const loader = ({context, params}: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  const token = params.token
  console.log('email-address-confirmed loader', {token})
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = ({context}: ActionFunctionArgs) => {
  const {
    // http, make
  } = context
  return null
}

export default function Page() {
  return (
    <main>
      <section> {/* gives it a nice width */}
        <h1>Email Address Confirmation</h1>
        <Form
          style={{
            border: 'none',
            boxShadow: 'none',
            textAlign: 'right',
            // marginTop: loggedInButtonFormTopMarginTweak,
          }}
          method="POST">
          <input type="hidden" name="intent" value={'log_in'} />
          <button style={{}} type={'submit'}>Login</button>
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

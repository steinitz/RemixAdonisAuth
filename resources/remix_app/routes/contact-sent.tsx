import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useRouteError,
  useSearchParams,
  Form, Link
} from "@remix-run/react";

export const loader = ({ context }: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

export const action = ({ context }: ActionFunctionArgs) => {
  const {
    // http, make
  } = context
  return null
}

export default function Page() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <main>
      <section>
        <Form action="/">
          <h1>We've sent your message to our support team</h1>
          <p>Our support team will reply to the email you provided: {email}</p>

          <h3>Wrong Email Address?</h3><Link to="/contact">Rewrite your Message</Link>
          <h3>Need more help?</h3><Link to="/contact">Contact Support</Link>
          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
            >
              Done
            </button>
          </div>
        </Form>

      </section>
    </main>
  );
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

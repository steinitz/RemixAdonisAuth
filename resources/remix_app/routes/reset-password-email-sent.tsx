// Confirms to the user that the app has sent a reset-password email

import {LoaderFunctionArgs} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useRouteError,
  useSearchParams} from "@remix-run/react";

export const loader = ({context}: LoaderFunctionArgs) => {
  const {
    // http,
    // make
  } = context

  return null}

export default function Page() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''


  return (
    <main>
      <section>
        <Form action="/">
          <h1>Email Sent</h1>
          <p>We have sent you an email at {email}.</p>
          <p>Check your inbox and follow the instructions to reset password</p>

          <h3>Didn't receive the mail?</h3><Link to={`/reset-password-request/${email}`}>Resend Email</Link>
          <h3>Wrong Email Address?</h3><Link to="/reset-password-request">Change Email Address</Link>
          <h3>Need Help?</h3><Link to="/contact">Contact Support</Link>
          <div style={{textAlign: "right"}}>
            <button
              type="submit"
            >
              Done
            </button>
          </div>
        </Form>

      </section>
    </main>
  );}

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

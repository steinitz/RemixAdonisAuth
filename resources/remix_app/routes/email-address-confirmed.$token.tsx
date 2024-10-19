import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import {
  errorStringUserNotDefined,
  routeStrings
} from "#remix_app/constants";
import {
  registrationCookie
} from "#remix_app/cookies.server";
import {
  sendEmailAddressConfirmationEmail
} from "#remix_app/emails/sendEmailAddressConfirmationEmail";
import {
  getDomainUrl
} from "#remix_app/utilities/getDomainUrl";

export const loader = async ({context, params}: LoaderFunctionArgs) => {
  const {
    // http,
    make
  } = context
  const token = params.token
  console.log('email-address-confirmed loader', {token})
  const userService = await make('user_service')
  let user
  let tokenHasExpired
  try {
    ({user, tokenHasExpired} = await
      userService.getUserWithEmailConfirmationToken(token || ''))
    if(user && !tokenHasExpired){
      userService.setIsEmailConfirmed(user, true)
    }
  }
  catch (error) {
    throw error
  }
  return json({user, tokenHasExpired})
}

const intents = {login: 'log_in', resendLink: 'resend_confimation_link'}

export const action = async ({context}: ActionFunctionArgs) => {
  const {
    http,
    make
  } = context

  const {intent} = http.request.only(['intent'])

  if (intent === intents.login) {
    return redirect(routeStrings.login)
  }
  else if (intent === intents.resendLink) {
    // get the email address from the cookie saved by the registration route
    const cookieHeader = context.http.request.request.headers.cookie;
    const cookie = await registrationCookie.parse(cookieHeader ?? '' ) || {};
    const registeredEmail = cookie?.email

    const userService = await make('user_service')

    await sendEmailAddressConfirmationEmail(
      userService,
      registeredEmail,
      getDomainUrl(http.request));
    return redirect(`/`)
  }

  return null
}

export default function Page() {
  const {tokenHasExpired, user} = useLoaderData<typeof loader>()
  return (
    <main>
      <section> {/* gives it a nice width */}
        { !tokenHasExpired ?
          <Form method="POST">
            <h1 style={{textAlign: "center"}}>Thank you for confirming your email</h1>
            <p style={{textAlign: "center"}}>{user?.email}</p>
            <br />
            <input type="hidden" name="intent" value={intents.login} />
            <div
              style={{textAlign: "center"}}>
              <button type="submit">Login</button>
            </div>
          </Form>

          :

          <Form method="POST">
            <h1 style={{textAlign: "center"}}>Expired link. &nbsp;Please try again.</h1>
            <input type="hidden" name="intent" value={intents.resendLink} />
            <div
              style={{textAlign: "center"}}>
              <button type="submit">Send another confirmation email</button>
            </div>
          </Form>
        }
      </section>
    </main>
  )
}

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();
  let result
  if (isRouteErrorResponse(error)) {
    result = (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    if (error.message.includes(errorStringUserNotDefined)) {
      result = (
        <main>
          <section>
            <Form>
              <h1>Error</h1>
              <p>No valid email-confirmation token found</p>
              <p>Please register again or contact support</p>
              <Link to="/register">Register</Link>
              <Link to="/contact">Support</Link>
            </Form>
          </section>
        </main>
      )
     }
      else {
        result = (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      )
    }
  }
  else {
    result = <h1>Unknown Error</h1>;
  }
  return result;
}

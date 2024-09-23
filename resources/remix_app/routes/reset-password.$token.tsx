import {
  Link, useLoaderData, useNavigate
} from "@remix-run/react";
// The link in the pasword-reset email takes the user here

import {
  LoaderFunctionArgs, json, ActionFunctionArgs, redirect
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";
import { PasswordField } from "~/components/PasswordField";

const getUser =  async (token: any, make: (arg0: string) => any) => {
  console.log('reset-password loader', { token})
  if (!token) {
    throw new Error(errorStringUserNotDefined)
  }

  const userService = await make('user_service')
  let user
  let tokenHasExpired
  try {
    ({user, tokenHasExpired} = await userService.getUserWithPasswordResetToken(token || ''))
    // if (user) {
    //   tokenHasExpired = userService.tokenHasExpired(user)
    // }
  }
  catch (error) {
    throw error
  }
  return {user, tokenHasExpired}
}

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const {
    // http,
    make
  } = context
  const token = params.token
  const {user, tokenHasExpired} = await getUser(token, make)
  return json({user, tokenHasExpired})
}

export const action = async ({context, params}: ActionFunctionArgs) => {
  const {make, http} = context
  const token = params.token
  const {password } = http.request.only(['password'])
  const userService = await make('user_service')
  try {
    const {user} = await getUser(token, make)
    userService.updatePassword(user, password)
  }
  catch (error) {
    throw error
  }
  return redirect('/login')
}

export default function Page() {
  const {tokenHasExpired, user} = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  return(
    <main>
      <section> {/* gives it a nice width */}
        <Form method="post">
          {
            tokenHasExpired || !user ?
            (<>
              <h1 style={{ textAlign: "center" }}>
                { !user ?
                  "Something went wrong, can't reset password" :
                  'Reset-password link has expired'
                }
              </h1>
              <p>You can request another password-reset from the Login page</p>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <button onClick={() => navigate(`/contact`)}>Contact Support</button>
                <button onClick={() => navigate(`/login`)}>Login Page</button>
              </div>
            </>) :
            (<>
              <h1 style={{ textAlign: "center" }}>Set new password</h1>
              { PasswordField() }
              <div style={{ textAlign: "right" }}>
                <button type="submit">Set password</button>
              </div>
            </>)
          }
      </Form>
    </section>
</main>
)
}

const errorStringUserNotDefined = 'User is not defined'

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();
  let result;
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
    //// console.log(error)
    if (error.message.includes(errorStringUserNotDefined)) {
      result = (
        <main>
          <section>
            <Form>
              <h1>Error</h1>
              <p>No valid password-reset token found</p>
              <p>Please initiate a password-reset request in the Login page</p>
              <Link to="/login">Login</Link>
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
    result = (<h1>Unknown Error</h1>);
  }
  return result;
}

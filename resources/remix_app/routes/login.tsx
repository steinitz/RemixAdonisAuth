import {
  ActionFunctionArgs,
  json,
  redirect
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useRouteError
} from '@remix-run/react'
import {noValue} from '#remix_app/constants'
import {PasswordInput} from "#remix_app/components/InputFields";
import {
  createIsEmailValidationSchema,
  createLoginValidationSchema
} from "#validators/authenticationValidation";
import {ValidatedInput} from "#remix_app/components/ValidatedInput";

const validationSchema = createLoginValidationSchema()

// Used to determine whether the user is logging
// in with an email or a username.
// That way we don't have to write fresh code to
// check if an email address - we use Adonis.
const isEmailValidationSchema = createIsEmailValidationSchema()

// called on form submission
export const action = async ({context}: ActionFunctionArgs) => {

  // This solves a problem where the Login page crashes with
  // no-context error immediately after clicking the link in
  // the confirm email message.  Does seem dubious though.
  if (!context) {
    console.warn('Login page - no context, returning')
    return
  }

  const {http, make} = context

  // get email (or username) and password from the form submission
  const {email, password} = http.request.only(['email', 'password'])

  let validationErrors
  let loginError
  try {
    // vine can sanitize what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({email, password})
  }
  catch (error) {
    validationErrors = error.messages
    console.log({validationErrors})
  }

  if (!validationErrors) {

    // determine whether the user is logging in with an email or a username
    let isEmail = true // assume email
    try {
      await isEmailValidationSchema.validate ({email})
    }
    catch (error) {
      // console.log('login action', {email}, 'is not an email address', {error})
      isEmail = false
    }

    // look up the user by email
    // return an error message if not found
    let user
    const userService = await make('user_service')
    try {
      if (isEmail) {
        // console.log('login action - user supplied an email address')
        user = await userService.getUserForEmail(email)
      }
      else {
        // console.log('login action - user supplied a username')
        user = await userService.getUserForUsername(email);
      }
    }
    catch (error) {
      loginError = `${isEmail ? 'email' : 'username'} not found`
    }

    // check if the password is correct
    // if not, return an error message

    let verifyPasswordResult
    if (!loginError && user) {
      // console.log('login action - verifying password')
      verifyPasswordResult = await userService.verifyPassword(user, password);

      if (verifyPasswordResult === true) {
        // credentials ok so log in user
        if (!userService.getIsEmailConfirmed(user)) {
          loginError = "email not confirmed, please check your inbox";
        }
        else {
          // console.log('login action - attempting login')
          await http.auth.use('web').login(user)
        }
      }
      else {
        // throw new Error('Invalid credentials')
        loginError = "invalid credentials";
      }
    }
  }

  console.log('login action', {validationErrors, loginError})

  const returnValue = validationErrors || loginError ?
    json({
      validationErrors,
      loginError
    }) :
    redirect(`/home`)

  return returnValue
}

export default function Page() {
  const actionData = useActionData<typeof action>()
  const {
    loginError,
    validationErrors
  } = actionData ?? {}

  return (
    <main>
      <section> {/* gives it a nice width */}

        <Form method="post">
          <h1 style={{textAlign: "center"}}>Log in</h1>
          <label>
            Email or Username
            <ValidatedInput
              fieldName='email'
              validationErrors={validationErrors}
            />
          </label>
          <PasswordInput />
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <p style={{maxWidth: '180px', lineHeight: 1.2, color: 'var(--color-error)'}}>
              {loginError ?? ' '}
            </p>
            <button type="submit">Login</button>
          </div>
          <details>
            <summary>Can't log in?</summary>
            <p>Don't yet have an account? <Link to="/register">Register</Link></p>
            <p>Forgot Password?
              <Link to={`/reset-password-request/${noValue}`}>
                Reset Password
              </Link>
            </p>
            <p>Get Help <Link to="/contact">Contact Support</Link></p>
          </details>
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
  }}

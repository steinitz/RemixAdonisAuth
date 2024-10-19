import {
  type ActionFunctionArgs,
  json,
  type  LoaderFunctionArgs,
  redirect
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useRouteError
} from "@remix-run/react";
import {
  EmailInput,
  FullNameInput,
  PasswordInput,
  PreferredNameInput,
  UsernameInput
} from "#remix_app/components/InputFields";
import {
  createRegistrationValidationSchema
} from "#validators/authenticationValidation";
import {
  getDomainUrl
} from "#remix_app/utilities/getDomainUrl";
import {
  sendEmailAddressConfirmationEmail
} from "#remix_app/emails/sendEmailAddressConfirmationEmail";
import {
  registrationCookie
} from "#remix_app/cookies.server";
import {
  errorStringUserNotDefined,
  routeStrings
} from "#remix_app/constants";

export const loader = ({context}: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

const validationSchema = createRegistrationValidationSchema()

export const action = async ({context}: ActionFunctionArgs) => {
  const {http, make} = context

  // get form data
  const {email, username, fullName, preferredName, password} = http.request.only(
    ['email', 'username', 'fullName', 'preferredName', 'password']
  )

  let validationErrors
  try {
    // vine can sanitize what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({
      email, password, username, fullName, preferredName
    });
  }
  catch (error) {
    validationErrors = error.messages
    console.log({validationErrors})
    return json({validationErrors})
  }

  // if no validation errors create the user

  // get the UserService from the app container
  const userService = await make('user_service')

  // the user might exist already because over validation passes
  // the unique test if the email address is unconfirmed
  // However, since the database itself has a unique requirement
  // on email addresses we need to avoid creating a new user,
  // which will fail.
  // Instead, we update the existing user.

  try {
    const user = await userService.getUserForEmail(email);
    userService.updateUser({
      user,
      email,
      username,
      fullName,
      preferredName,
      password,
    })
  }
  catch(error) {
    console.log({error})
    if (error.message.includes(errorStringUserNotDefined)) {
      await userService.createUser({
        email,
        username,
        fullName,
        preferredName,
        password
      });
    }
    else {
      throw error
    }
  }

  // save the unconfirmed email address for 24 hours
  // so we can show it on the index page or resend the
  // confirmation link
  const cookieHeader = context.http.request.request.headers.cookie;
  const cookie =
    await registrationCookie.parse(cookieHeader ?? '' ) || {};
  console.log('register action', {cookie})
  cookie.email = email

  await sendEmailAddressConfirmationEmail(userService, email, getDomainUrl(http.request));

  // No. Now we wait for the user to click the link in the email.
  // log in the user after successful registration
  // await http.auth.use('web').login(user)

  return redirect(
    `/`,
    // Easy step to forget with Adonis cookie creation.
    // Might be easier to remember if I understood what
    // the hell it's doing.
    {
      headers: {
        'Set-Cookie': await registrationCookie.serialize(cookie)
      }
    }
  )
}

export default function Page() {
  const actionData: Record<string, any> | undefined = useActionData<typeof action>()
  const validationErrors = actionData?.validationErrors ?? []

  // validationErrors && console.log('register page', {validationErrors})

  return (
    <main>
      <section> {/* gives it a nice width */}
        <Form
            method="post">
          <h1
              style={{textAlign: "center"}}>Register</h1>
          <p>Already have an account? <Link to={routeStrings.login}>Log In</Link>
          </p>
          <EmailInput validationErrors={validationErrors} />
          <PasswordInput validationErrors={validationErrors} />
          <UsernameInput validationErrors={validationErrors} />
          <PreferredNameInput validationErrors={validationErrors} />
          <FullNameInput validationErrors={validationErrors} />
          <div
            style={{textAlign: "right"}}>
            <button
              type="submit">Register
            </button>
          </div>
        </Form>
        {/*}*/}
      </section>
    </main>
  )
}

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
    // This shouldn't happen given our email unique check, above
    // but just in case...
    if (error.message.includes('UNIQUE constraint failed: users.email')) {
      result = (
        <main>
          <section>
            <Form>
              <h1>Error</h1>
              <p>Email address is already in use</p>
              <p>Please try again</p>
              <Link to="/register">Register</Link>
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

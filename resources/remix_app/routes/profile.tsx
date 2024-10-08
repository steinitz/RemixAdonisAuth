import {
  type ActionFunctionArgs,
  type  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  Link, useActionData,
  useRouteError
} from "@remix-run/react";
import {
  EmailInput,
  FullNameInput,
  LoginNameInput,
  PasswordInput,
  PreferredNameInput
} from "~/components/InputFields";
import {
  createProfileValidationSchema,
} from "#validators/authenticationValidation";

export const loader = ({context}: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

const validationSchema = createProfileValidationSchema()

export const action = async ({context}: ActionFunctionArgs) => {
  const {http, make} = context

  // get form data
  const {email, username, preferredName, fullName, password} = http.request.only(
    ['email', 'username', 'preferredName', 'fullName', 'password']
  )

  let validationErrors
  try {
    // vine can sanitize what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({email, password});
  }
  catch (error) {
    validationErrors = error.messages
    console.log({validationErrors})
    return json({validationErrors})
  }

  // if no validation errors create the user

  // get the UserService from the app container
  const userService = await make('user_service')

  const user = await userService.createUser({
    email,
    username,
    preferredName,
    fullName,
    password,
  })

  // log in the user after successful registration
  await http.auth.use('web').login(user)

  return redirect(`/home`)
}

export default function Page() {
  const {validationErrors} = useActionData<typeof action>() ?? []
  console.log('register page', {validationErrors})

  return (
    <main>
      <section > {/* gives it a nice width */}
        <Form
          method="post">
          <h1
            style={{textAlign: "center"}}
          >
            Profile
          </h1>
          <EmailInput validationErrors={validationErrors} />
          <PasswordInput validationErrors={validationErrors} />
          <LoginNameInput validationErrors={validationErrors} />
          <PreferredNameInput validationErrors={validationErrors} />
          <FullNameInput validationErrors={validationErrors} />
          <div
            style={{textAlign: "right"}}>
            <button
              type="submit">Save
              Changes
            </button>
          </div>
        </Form>
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

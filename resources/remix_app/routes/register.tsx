// generated via cli: node ace remix:route --action --error-boundary register
// warnings commented out by SJS

import {
  type ActionFunctionArgs,
  type  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node'
import {
  Form,
  // useActionData,
  // useLoaderData,
  isRouteErrorResponse,
  Link,
  useRouteError
} from '@remix-run/react'
import {PasswordField} from '../Components/PasswordField'

export const loader = ({context}: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })
}

// resources/remix_app/routes/register.tsx
export const action = async ({ context }: ActionFunctionArgs) => {
  console.log('Reset Password - action method')
  const { http, make } = context
  // get email address form data
  const { email } = http.request.only(['email'])

  // get the UserService from the app container
  const userService = await make('user_service')


  const user = await userService.createUser({
    email,
    password,
  })

  // log in the user after successful registration
  await http.auth.use('web').login(user)

  return redirect('/')
}

export default function Page() {
  // const data = useLoaderData<typeof loader>()
  // const actionData = useActionData<typeof action>()


  return (
    <main>
      <section > {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{textAlign: "center"}}>Register</h1>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
          <label>
            Email
            <input type="text" name="email" />
          </label>
          {PasswordField()}
          <div style={{textAlign: "right"}}><button type="submit">Register</button></div>
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
    console.log(error)
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

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
import { useState } from 'react'

export const loader = ({ context }: LoaderFunctionArgs) => {
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
  console.log('Register - action method')
  const { http, make } = context
  // get email and password from form data
  const { email, password } = http.request.only(['email', 'password'])

  // get the UserService from the app container and create user
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

  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  return (
    <main>
      <section > {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{textAlign: "center"}}>Register</h1>
          <label>
            Email
            <input type="text" name="email" />
          </label>
          <label>
            <span>
              Password &nbsp; &nbsp;
              <button 
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "normal",
                  padding: "0.1rem 0.3rem",
                  width: "50px",
                }}
                type="button" 
                onClick={() => setShouldShowPassword(!shouldShowPassword)}
              >
                {shouldShowPassword ? "Hide" : "Show"}
              </button>
            </span>
            <input type={shouldShowPassword ? "text" :  "password"} name="password"/>
          </label>
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

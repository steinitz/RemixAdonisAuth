// generated via cli: node ace remix:route --action --error-boundary register
// warnings commented out by SJS

import {
  type ActionFunctionArgs,
  type  LoaderFunctionArgs,
  json,
  redirect} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  Link, useActionData,
  useRouteError} from "@remix-run/react";
import {PasswordField} from '#remix_app/components/PasswordField'
import {ValidatedInput} from "#remix_app/components/ValidatedInput";
import {createRegistrationValidationSchema} from "#validators/authenticationValidation";

export const loader = ({context}: LoaderFunctionArgs) => {
  const {
    http,
    // make
  } = context
  return json({
    message: 'Hello from ' + http.request.completeUrl(),
  })}

const validationSchema = createRegistrationValidationSchema()

export const action = async ({context}: ActionFunctionArgs) => {
  const {http, make} = context

  // get email and password from form data
  const {email, password} = http.request.only(['email', 'password'])

  let validationErrors
  try {
    // vine can sanitize what the user typed
    // here we just want the errors when vine throws
    await validationSchema.validate ({email, password});
  }
  catch (error) {
    validationErrors = error.messages
    console.log({validationErrors})
  }

  // if no validation errors send the support email

  if (!validationErrors) {
    // get the UserService from the app container
    const userService = await make('user_service')

    const user = await userService.createUser({
      email,
      password,
    })

    // log in the user after successful registration
    await http.auth.use('web').login(user)
  }

  const returnValue = validationErrors ?
    json({validationErrors}) :
    redirect(`/home`)

  return returnValue}

export default function Page() {
  const {validationErrors} = useActionData<typeof action>() ?? []
  console.log('register page', {validationErrors})
  return (
    <main>
      <section > {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{textAlign: "center"}}>Register</h1>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
          <label>
            Email
            <ValidatedInput fieldName='email' validationErrors
              ={validationErrors} />
          </label>
          {PasswordField({validationErrors})}
          <div style={{textAlign: "right"}}><button type="submit">Register</button></div>
        </Form>
      </section>
    </main>
  )}

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
  return result;}

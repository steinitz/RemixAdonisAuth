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
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import {
  EmailInput,
  FullNameInput,
  UsernameInput,
  PasswordInput,
  PreferredNameInput
} from "#remix_app/components/InputFields";
import {
  createProfileValidationSchema,
} from "#validators/authenticationValidation";
import User from '#models/user';

export const loader = async ({context}: LoaderFunctionArgs) => {
  const auth = context.http.auth

  // for non-authenticated routes the logged-in user won't
  // be available until we call auth.check()
  await auth.check()

  // Now we can get attributes of the logged-in user, if any.
  const user: Record<string, any> = auth.user as User
  // console.log('profile loader', {user})

  // I would prefer not to have to use snake for the attributes.
  // But how?  Something with the UserService?
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    username, preferred_name, full_name, email
  } = user


  return json({
    email,
    username,
    preferredName: preferred_name,
    fullName: full_name,
  })
}

const validationSchema = createProfileValidationSchema()

const intents = {save: 'save', delete: 'delete'}

export const action = async ({context}: ActionFunctionArgs) => {
  const {http, make} = context
  const auth = context.http.auth
  const user = auth.user
  const userService = await make('user_service')
  const {intent} = http.request.only(['intent'])
  console.log('logging intent', {intent})

  const saveChanges = async () => {
    // get form data
    const {
      email, username, preferredName, fullName, password
    } = http.request.only(
      ['email', 'username', 'preferredName', 'fullName', 'password']
    )

    let validationErrors
    try {
      // vine can sanitize what the user typed
      // here we just want the errors when vine throws
      await validationSchema.validate (
        {email, password},
        {meta: {userId: user?.id}}
      )
    }
    catch (error) {
      validationErrors = error.messages
      console.log({validationErrors})
      return json({validationErrors})
    }

    // if no validation errors create the user

    // get the UserService from the app container

    // const user = await userService.createUser({
    //   email,
    //   username,
    //   preferredName,
    //   fullName,
    //   password,
    // })
    if (!user) {
      throw new Error('no user')
    }
    userService.updateUser({user, email, username, preferredName, fullName, password})
    return redirect('/home')
  }

  const deleteUser = async () => {
    await http.auth.use('web').logout()
    console.log("delete user")
    if (!user) {
      throw new Error('no user')
    }
    userService.deleteUser(user)
  }

  if (intent === intents.save) {
    return saveChanges()
  }
  else if (intent === intents.delete) {
    await http.auth.use('web').logout()
    await deleteUser()
    return redirect('/')
  }
  else {
    console.warn("invalid intent - expected save or delete", {intent})
  }
}

export default function Page() {
  const {validationErrors} = useActionData<typeof action>() ?? []
  console.log('profile page', {validationErrors})
  const {email, username, preferredName, fullName} = useLoaderData<typeof loader>()
  console.log('profile page', {email, username, preferredName, fullName})
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
          <EmailInput
            validationErrors={validationErrors}
            defaultValue={email}
          />
          <PasswordInput validationErrors={validationErrors} />
          <UsernameInput
            validationErrors={validationErrors}
            defaultValue={username}
          />
          <PreferredNameInput
            validationErrors={validationErrors}
            defaultValue={preferredName}
          />
          <FullNameInput
            validationErrors={validationErrors}
            defaultValue={fullName}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <button
              type="submit"
              name="intent" value={intents.delete}
              style={{
                backgroundColor: 'var(--color-error)',
                borderColor: 'var(--color-error)'
              }}
            >
              Delete Account
            </button>
            <button
              type="submit"
              name="intent" value={intents.save}
            >
              Save Changes
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

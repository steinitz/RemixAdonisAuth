import {
  type ActionFunctionArgs,
  json,
  type  LoaderFunctionArgs,
  redirect,
  TypedResponse
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useLoaderData,
  useRouteError,
  useSubmit
} from "@remix-run/react";
import {
  EmailInput,
  FullNameInput,
  PasswordInput,
  PreferredNameInput,
  UsernameInput
} from "#remix_app/components/InputFields";
import {
  createProfileValidationSchema
} from "#validators/authenticationValidation";
import {
  SyntheticEvent,
  useRef,
  useState
} from "react";
import Dialog
  from "#remix_app/components/Dialog";
import {
  registrationCookieClear
} from "#remix_app/cookies.server";
import {
  getAuthenticatedUser
} from "#remix_app/utilities/adonisHelpers";

export const loader = async ({context}: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(context);

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

  // the form uses the intent key to tell us whether to save changes or delete the account
  const {intent} = http.request.only(['intent'])
  console.log('logging intent', {intent})

  let result: ReturnType<typeof redirect> | string | TypedResponse<any> = redirect('/')

  // two utility functions to save changes or delete the account

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
        // Vine validation will use the user Id to avoid
        // reporting a uniqueness issue for the email
        // address owned by this user.  Understand?
        {meta: {userId: user?.id}}
      )
    }
    catch (error) {
      validationErrors = error.messages
      console.log({validationErrors})
      result = json({validationErrors})
    }
    if (!user) {
      throw new Error('no user')
    }
    userService.updateUser({user, email, username, preferredName, fullName, password})
  }

  const deleteUser = async () => {
    await http.auth.use('web').logout()
    console.log("delete user")
    if (!user) {
      throw new Error('no user')
    }
    userService.deleteUser(user)
  }

  // do it

  if (intent === intents.save) {
    saveChanges()
    result = redirect('/home')
  }
  else if (intent === intents.delete) {
    await http.auth.use('web').logout()
    await deleteUser()
    // delete any registration cookie which might be hanging around

    result = redirect(
      '/',
      {headers: {...await registrationCookieClear()}}
    )
  }
  else {
    console.error("invalid intent - expected save or delete", {intent})
  }

  console.log('profile action return value', {result})
  return result
}

export default function Page() {
  const {validationErrors} = useActionData<typeof action>() ?? []
  const [shouldShowConfirmation, setShouldShowConfirmation] = useState(false)
  // console.log('profile page', {validationErrors})
  const {email, username, preferredName, fullName} = useLoaderData<typeof loader>()
  // console.log('profile page', {email, username, preferredName, fullName})
  const submit = useSubmit()
  const formRef = useRef(null)

  const handleDeleteAccountRequest = (event: SyntheticEvent) => {
    // prevent this button from submitting the form
    event.preventDefault();
    event.stopPropagation();

    // show the confirmation dialog
    setShouldShowConfirmation(true)
  }

  const handleDeleteConfirmation = () => {
    const formData = new FormData(formRef?.current || undefined)
    formData.set("intent", intents.delete)
    submit(formData, {
      method: "post"
    })
  }

  return (
    <main>
      <section> {/* gives it a nice width */}
        <Form
          method="post"
          ref={formRef}
        >
            <Dialog
              isOpen={shouldShowConfirmation}
              onClose={
                () => setShouldShowConfirmation(false)
              }
            >
              <h3>Delete Account? &nbsp;Can't be undone.</h3>
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
                  onClick={handleDeleteConfirmation}
                  style={{
                    backgroundColor: "var(--color-error)",
                    borderColor: "var(--color-error)"
                  }}
                >
                  Delete
                </button>
                <button onClick={() => setShouldShowConfirmation(false)}>
                  Cancel
                </button>
              </div>
            </Dialog>
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
              onClick={handleDeleteAccountRequest}
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

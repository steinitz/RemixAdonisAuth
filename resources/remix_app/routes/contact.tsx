import vine from "@vinejs/vine";
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, isRouteErrorResponse, useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import { convertTextMessageToHtml } from "~/utilities/convertTextMessageToHtml";
import { sendSupportEmail } from "~/utilities/sendSupportEmail";
import { FormFieldError } from "~/components/FormFieldError";
import { useState } from "react";
import { errorMessageFor, ValidatedInput } from "~/components/ValidatedInput";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const email = context.http.auth.user?.email
  return json({
    email,
  })
}

const validationSchema = vine.object({
  email: vine.string().email(),
  message: vine
    .string()
    .minLength(1)
    .maxLength(512)
})

export const action = async ({context}: ActionFunctionArgs) => {
  const {
    http,
    // make
  } = context

  // get the form values
  const {name, email, message} = http.request.only(['name', 'email', 'message'])

  // validate them
  let validationErrors

  try {
    // vine.validate returns sanitized versions of what the user typed
    // here we just want the errors when vine throws
    // sanitizedValues =
    await vine.validate({
      schema: validationSchema,
      data: {name, email, message}
    });
  }
  catch (error) {
    validationErrors = error.messages
  }

  // if no validation errors send the support email

  if (!validationErrors) {
    const textMessage = `sent from ${name}, ${email}, \n\n${message}`
    const htmlMessage = `<p>sent from ${name} - ${email}</p> ${convertTextMessageToHtml(message)}`
    // console.log(htmlMessage)
    sendSupportEmail(textMessage, htmlMessage)
  }

  const returnValue = validationErrors ?
    json({validationErrors}) :
    redirect(`/contact-sent?email=${email}`)
  return returnValue
}

export default function Page() {
  const {email = ''} = useLoaderData<typeof loader>()
  const { validationErrors } = useActionData<typeof action>() ?? []

  // big song and dance to keep the message in case the
  // user notices she has typed in the wrong email address
  // when she lands on the contact-sent page
  const saveMessage = () => {
    var now = new Date();
    now.setTime(now.getTime() + 2 * 60 * 1000); // keep for two minutes
    document.cookie = `message=${message}; expires=${now.toUTCString()}; Secure`;
  }

  const retrieveSavedMessage = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("message"))
      ?.split("=")[1];
    return cookieValue
  }

  const [message, setMessage] = useState(retrieveSavedMessage())


  return (
    <main>
      <section> {/* gives it a nice width */}
        <Form method="post" onSubmit={saveMessage}>
          <h1 style={{ textAlign: "center" }}>Contact Support</h1>
          <label>
            Name
            <ValidatedInput
              fieldName='name'
              validationErrors={ validationErrors}
            />
          </label>
          <label>
            Email
            <input type="text" name="email" defaultValue={email} />
            <FormFieldError
              message={
                errorMessageFor(
                  'email',
                  validationErrors
                )
              }
            />
          </label>
          <label>
            Message
            <textarea rows={8} name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <FormFieldError
              message={
                errorMessageFor(
                  'message',
                  validationErrors
                )
              }
            />
          </label>
          <div style={{ textAlign: "right" }}>
            <button type="submit">Send</button>
          </div>
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
  }
}


// graveyard

  // const testMessage = '*** remember to include user email address here ' +
  //   'since SMTP2Go won\'t allow another domain to send. \n\n' +
  //   'Well done for using this project idea to create something useful.\n' +
  //   'If you want to learn more about the Markdown syntax, which lets you ' +
  //   'use text to easily create HTML documents, you can learn more about it ' +
  //   'from Mastering markdown 223.'


import vine from "@vinejs/vine";
import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {
  Form, isRouteErrorResponse, useActionData, useLoaderData, useRouteError
} from "@remix-run/react";
import {convertTextMessageToHtml} from "~/utilities/convertTextMessageToHtml";
import {sendSupportEmail} from "~/emails/sendSupportEmail";
import {FormFieldError} from "~/components/FormFieldError";
import {errorMessageFor, ValidatedInput} from "~/components/ValidatedInput";
import {contactFormCookie} from "~/cookies.server";

const validationSchema = vine.object({
  email: vine.string().email(),
  message: vine
    .string()
    .minLength(1)
    .maxLength(512)
  }
)

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
    // early return if validation errors
    return json({validationErrors})
  }

  // if no validation errors do two things:

  // 1. save the message, for two minutes, in case the user wants to
  //    send it again, for example, with a corrected email address
  const cookieHeader = context.http.request.request.headers.cookie;
  const cookie =
    (await contactFormCookie.parse(cookieHeader ?? '' )) || {};
  cookie.message = message

  // 2. send the support emai
  const textMessage = `sent from ${name}, ${email}, \n\n${message}`
  const htmlMessage = `<p>sent from ${name} - ${email}</p> ${convertTextMessageToHtml(message)}`
  // console.log(htmlMessage)
  sendSupportEmail(textMessage, htmlMessage)

  return redirect(
    `/contact-sent?email=${email}`,
    {
      headers: {
        'Set-Cookie': await contactFormCookie.serialize(cookie)
      }
    }
  )
}

export const loader = async ({context}: LoaderFunctionArgs) => {
  const email = context.http.auth.user?.email

  // we save the user's message in the action function and retrieve
  // it here, from the cookie
  const cookieHeader = context.http.request.request.headers.cookie;
  const cookie =
    (await contactFormCookie.parse(cookieHeader ?? '' )) || {};

  return json({
    email,
    message: cookie.message,
  })
}

export default function Page() {
  const {
    email = '',
    message // the saved previous message for user convenience
  } = useLoaderData<typeof loader>()
  const {validationErrors} = useActionData<typeof action>() ?? []

  return (
    <main>
      <section> {/* gives it a nice width */}
        <Form method="post">
          <h1 style={{textAlign: "center"}}>Contact Support</h1>
          <label>
            Name
            <ValidatedInput
              fieldName='name'
              validationErrors={validationErrors}
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
            <textarea rows={8} name="message" defaultValue={message}/>
            <FormFieldError
              message={
                errorMessageFor(
                  'message',
                  validationErrors
                )
              }
            />
          </label>
          <div style={{textAlign: "right"}}>
            <button
              type="submit"
            >
              Send
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


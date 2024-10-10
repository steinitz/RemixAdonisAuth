import mail from "@adonisjs/mail/services/main"
import {redirect} from "@remix-run/node"
import {supportEmail} from "#remix_app/constants";

export async function sendSupportEmail(
  userMessageText: string,
  userMessageHtml: string
) {
  await mail.send((message) => {
      message
      .to(supportEmail)

      // we don't need .from because it defaults
      // to the value in config/mail.ts
      // .from('info@example.org')

      .subject(`Contact Form`)

      // what is this?
      // .htmlView('emails/verify_email', {user})

      // HTML contents
      .html(userMessageHtml)

      // Plain text contents
      .text(userMessageText);
    }
  );
  return redirect(`/contact-sent`);
}

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
        // .from('info@example.org')
        .subject(`Contact Form`)
        // .htmlView('emails/verify_email', {user})

        // HTML contents
        .html(userMessageHtml)

        // Plain text contents
        .text(userMessageText);
    }
  );
  return redirect(`/contact-sent`);
}

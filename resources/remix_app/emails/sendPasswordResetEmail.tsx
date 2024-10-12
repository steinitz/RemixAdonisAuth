import mail from "@adonisjs/mail/services/main"
import {companyName} from '#remix_app/constants'

export async function sendPasswordResetEmail(
  email: string,
  domain: string,
  token: string,
) {
  // const userService = await make("user_service");

  const passwordResetUrl = `${domain}/reset-password/${token}`;
  // const passwordResetUrl = `${getDomainUrl(http.request)}/reset-password/${token}`;

  await mail.send((message) => {
      message
      .to(email)

      // we don't need .from because it defaults
      // to the value in config/mail.ts
      // .from('info@example.org')

      .subject(`Reset Your ${companyName} Password\n\n`)

      // what is this?
      // .htmlView('emails/verify_email', {user})

      // HTML contents
      .html(`
        <p>We understand that you’ve requested to reset your password for your ${companyName} account.</>
  
        <p>Click this link to reset your password page: ${passwordResetUrl}</p>

      `)

        // Plain text contents
        .text(`
        We understand that you’ve requested to reset your password for your ${companyName} account.

        Click this link to reset your password page: ${passwordResetUrl}

      `);
    }
  );
  // we no longer do this because it was too hard to reliably
  // show a loading spinner while the email is being sent
  // return redirect(`/reset-password-email-sent?email=${email}`)
}

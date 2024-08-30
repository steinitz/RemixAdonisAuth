import mail from "@adonisjs/mail/services/main"
import {redirect} from "@remix-run/node"
// import {getDomainUrl} from './getDomainUrl'
import {companyName} from '../constants'

export async function sendPasswordResetEmail(
  email: string,
  domain: string,
  userService: any,
) {
  // const userService = await make("user_service");
  let token;
  try {
    token = await userService.setPasswordResetTokenFor(email);
  } catch (error) {
    console.warn(error);
  }

  const passwordResetUrl = `${domain}/reset-password/${token}`;
  // const passwordResetUrl = `${getDomainUrl(http.request)}/reset-password/${token}`;

  await mail.send((message) => {
      message
        .to(email)
        // .from('info@example.org')
        .subject(`Reset Your ${companyName} Password\n\n`)
        // .htmlView('emails/verify_email', { user })
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

  return redirect(`/reset-password-email-sent?email=${email}`);
}
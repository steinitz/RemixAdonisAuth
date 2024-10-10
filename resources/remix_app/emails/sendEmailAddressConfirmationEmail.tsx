import mail from "@adonisjs/mail/services/main"
import {companyName} from '#remix_app/constants'
import User from "#models/user";
import {
  convertTextMessageToHtml
} from "~/utilities/convertTextMessageToHtml";

const plainTextMessage = (
  bestName: string,
  link: string,
) => `Hello ${bestName}
Thanks for registering an account with ${companyName}

Before we get started, for your security, please verify your email address to ensure it was really you who registered.  Please click the link below.

${link}

If you encounter any issues, try pasting the above link into your web browser.  Or, reply to this email and we'll help.

The link expires in two hours.  Didn’t register? Just ignore this email.

We’re glad you’re here,

${companyName}
`

export async function sendEmailAddressConfirmationEmail(
  domain: string,
  userService: any,
  user: User,
) {
  let token;
  try {
    token = await userService.setEmailConfirmationTokenFor(user.email);
  } catch (error) {
    console.warn(error);
  }

  const emailConfirmationUrl = `${domain}/email-address-confirm/${token}`;
  const bestName = userService.bestNameForAddressingUser(user)

  const plainText = plainTextMessage(bestName, emailConfirmationUrl)

  await mail.send((message) => {
      message
      .to(user.email)

      // we don't need .from because it defaults
      // to the value in config/mail.ts
      // .from('info@example.org') - we already default to

      .subject(`Activate Your Account with ${companyName}\n\n`)

      // what is this?
      // .htmlView('emails/verify_email', {user})

      // HTML contents
      .html(convertTextMessageToHtml(plainText))

      // Plain text contents
      .text(plainText);
    }
  );

  // we no longer do the redirect because it was too hard to
  // show a loading spinner while the email is being sent

  // return redirect(`/reset-password-email-sent?email=${email}`)
}

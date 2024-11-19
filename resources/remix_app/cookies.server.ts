import {createCookie} from "@remix-run/node";

// The remix doc suggests putting cookie creation
// in a .server file prevent the code from being
// unnecesarily on the browser

// I'm not clear if I can put multiple cookie values
// into a single cookie.  Currently only the contact
// form uses this and only to temporarily store the
// contact form message, as a user convenience.

// Quick expiry
const contactMaxAge = 2 * 60 * 1000 // two minutes

export const contactFormCookie = createCookie(
  'message', {maxAge: contactMaxAge, secure: true}
)

const registrationMaxAge = 24 *60 * 60 * 1000 // twenty-four hours

export const registrationCookie = createCookie(
  'email', {maxAge: registrationMaxAge, secure: true}
)

// registrationCookie helpers

// add this to the headers of the response - see profile.tsx and _index.tsx
export const registrationCookieClear = async () => {
  // Is this the best way to delete the cookie?
  // The move fine-grained deletion, of just the email, doesn't seem to work
  return {"Set-Cookie": await registrationCookie?.serialize?.('', {maxAge: 1})}
}

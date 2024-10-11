import {createCookie} from "@remix-run/node";

// The remix doc suggests putting cookie creation
// in a .server file prevent the code from being
// unnecesarily on the browser

// I'm not clear if I can but multiple cookie values
// into a single cookie.  Currently only the contact
// form uses this and only to temporarily store the
// contact form message, as a user convenience.

// Quick expiry
const theMaxAge = 2 * 60 * 1000 // two minutes

export const contactFormCookie = createCookie(
  'message', {maxAge: theMaxAge, secure: true}
)

export const registrationCookie = createCookie(
  'email', {maxAge: theMaxAge, secure: true}
)

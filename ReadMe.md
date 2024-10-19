[Official Remix-Adonis Docuementation](https://matstack.dev/remix-adonisjs/)

## Here's how I started the project

Create a fresh remix-adonisjs project using the Remix starter template:

`npm init adonisjs@latest -- -K="github:jarle/remix-starter-kit"`

You should now be able to start building! Just jump into your new folder and start the dev server with 

`npm run dev`.

The project follows the conventional AdonisJS structure, with the Remix application being placed in resources/remix_app.

A good next step could be to follow [our guide on how to build a login flow](https://matstack.dev/remix-adonisjs/hands-on/building-a-login-flow) for your new application.

## Expanding Authentication

After following the above to create a project and build the login flow, I added other athentication basics: validation/uniqueness, password reset, email confirmation, contact-support form.

## A note on Unique Email Addresses

The registration process might fail.
So we might have to ask the user to register again but want to avoid the annoying case where the user's email is already in the
database so the unique-ing fails... "contact support".

We have to be careful overriding the unique-ing. It would have to be temporary.  Or would it?
Maybe the whole unique-ing idea is flawed:
Maybe any user who can get a message at an email address should be able to claim that account, provided the email is unconfirmed.
That barely takes into consideration Adrian’s (security expert) story of people buying expired domains for sinister purposes e.g. claiming old accounts.

For now, if the email is not confirmed, and the user is trying to register, we assume it’s a fresh account and let them register, providing they can get a message at that email address.  

How would it get unconfirmed?  We currently never un-confirm the email.

We treat username the same.

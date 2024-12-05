[Official Remix-Adonis Documentation](https://matstack.dev/remix-adonisjs/)

This project is based on Jarle's excellent [Remix starter kit](https://github.com/jarle/remix-starter-kit).

## Here's how I started the project

Create a fresh remix-adonisjs project using the Remix starter template:

`npm init adonisjs@latest -- -K="github:jarle/remix-starter-kit"`

You should now be able to start building. cd into your new directory and start the dev server with 

`npm run dev`

According to Jarle, the project follows a conventional AdonisJS structure, with the Remix application being placed in resources/remix_app. 

The alternative would be to use Adonis Inertia.  The current solution is more immediate, tactile and hands-off -- more set-and-forget.

Next I followed Jarle's helpful guide to adding authentication to the project: [Adding Authentication](https://matstack.dev/remix-adonisjs/adding-authentication)

## Expanding Authentication

The point of this project is to add additional, familiar features of an authentication system and then use it as a basis for other projects.

After following the above steps to create a project and build the login flow, I added other athentication basics: validation/uniqueness, password reset, email confirmation, contact-support form, user profile.

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

import User from '#models/user';
import hash from '@adonisjs/core/services/hash';
import {DateTime} from 'luxon'
import string from "@adonisjs/core/helpers/string";
// import db from '@adonisjs/lucid/services/db'


type TokenType = 'password_reset_token' | 'email_confirmation_token'
type TokenExpiryType = 'password_reset_token_expiry' | 'email_confirmation_token_expiry'

export default class UserService {

  // User

  async createUser(props: {
    email: string
    username?: string
    fullName?: string
    preferredName?: string
    password: string
  }): Promise<User> {
    const user = await User.create({
      email: props.email,
      password: props.password,
    })

    if (props.username) {
      user.username = props.username
    }

    if (props.preferredName) {
      user.preferred_name = props.preferredName
    }

     if (props.fullName) {
      user.full_name = props.fullName
    }

    user.is_email_confirmed = false // do I need this?  The AI suggested it.
    user.save()

    return user
  }

  async getUserForEmail(email: string) {
    return await User.findByOrFail('email', email)
  }

  async getUserForUsername(username: string) {
    return await User.findByOrFail('username', username)
  }

  // Password Reset

  async setPasswordResetTokenFor(email: string) {
    return await this.setTokenFor(email, 'password_reset_token')
  }

  async getUserWithPasswordResetToken(
    token: string):
    Promise< {user: User | undefined, tokenHasExpired: boolean}> {
    return this.getUserWithToken(token, 'password_reset_token')
  }

  // Email Confirmation

  async setEmailConfirmationTokenFor(email: string) {
    return await this.setTokenFor(email, 'email_confirmation_token')
  }

  async getUserWithEmailConfirmationToken(
    token: string):
    Promise< {user: User | undefined, tokenHasExpired: boolean}> {
    return this.getUserWithToken(token, 'email_confirmation_token')
  }

  // Password

  async updatePassword(user: User, password: string)
  {
    // Note - hashing the password isn't necessary because
    // according to the Adonis Authentication docs, in the
    // Verifying User Credentials section:

    // "The AuthFinder mixin registers a beforeSave hook to
    // automatically hash the user passwords during INSERT and
    // UPDATE calls. Therefore, you do not have to manually
    // perform password hashing in your models."

    // Nice.  And it seems to work.

    user.password = password
    user.save()
  }

  async verifyPassword(user: User, password: string) {
    let userPassword = user.password
    if (!userPassword) {
      userPassword = ''
      console.warn("User.verifyPassword received null password");
    }
    return hash.verify(userPassword || '', password)
  }

  // Token utilities

  // Token expiry for password-reset AND email confirmation
  tokenExpiryHours = 2

  // looks for user, via email, throws if not found
  // creates either a password-reset or email-confirmation token
  // sets the relevant field and expiry field on the user
  // returns the token
  async setTokenFor(email: string, tokenType: TokenType) {
    const user = await this.getUserForEmail(email)
    if (!user) {throw new Error('user not found')}
    const token = string.generateRandom(64)
    user[tokenType] = token

    const tokenExpiryField: TokenExpiryType = `${tokenType}_expiry`
    user[tokenExpiryField] = DateTime
      .local()
      .plus({hours: this.tokenExpiryHours})

    user.save()

    return token
  }

  async getUserWithToken(
    token: string,
    tokenType: TokenType
  ):
    Promise< {user: User | undefined, tokenHasExpired: boolean}>{
    let user
    let tokenHasExpired = true

    try {
      user = await User.findByOrFail(tokenType, token) || {}
      const tokenExpiryField: TokenExpiryType = `${tokenType}_expiry`
      const tokenExpiry = user?.[tokenExpiryField]
      tokenHasExpired = tokenExpiry ? tokenExpiry < DateTime.local() : true
    }
    catch(error){
      console.warn(`no user found with specified ${tokenType}`, {token})
    }

    return {
      user,
      tokenHasExpired
    }
  }


}

import User
  from "#models/user";
import hash
  from "@adonisjs/core/services/hash";
import {
  DateTime
} from "luxon";
import string
  from "@adonisjs/core/helpers/string";
// import db from '@adonisjs/lucid/services/db'


type TokenType = 'password_reset_token' | 'email_confirmation_token'
type TokenExpiryType = 'password_reset_token_expiry' | 'email_confirmation_token_expiry'

export const errorStringNoUserFoundForToken = "No User found for token";

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

updateUser({
    user,
    email,
    username,
    fullName,
    preferredName,
    password,
 }: {
    user: User
    email: string
    username?: string
    fullName?: string
    preferredName?: string
    password?: string
  }): User {
    if(email) {
      user.email = email
    }
    if (password) {
      user.password = password
    }
    if (username) {
      user.username = username
    }
    if (preferredName) {
      user.preferred_name = preferredName
    }
    if (fullName) {
      user.full_name = fullName
    }

    user.save()

    return user
  }

  deleteUser(user: User) {
    user.delete()
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

  async getUserWithPasswordResetToken(token: string):
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
    console.log("user_service.setTokenFor", {token})
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

  // bestNameForAddressingUser

  async bestNameForAddressingUser(user: User) {

    let result = 'Valued User'
    let extractedFromEmail

    if (user.preferred_name) {
       result = user.preferred_name
    }
    else if (user.full_name) {
      result = user.full_name.replace(/ .*/,'')
    }
    else if (user.username) {
      result = user.username
    }
    // note: this is not a comparison, it sets the value of extractedFromEmail
    // eslint-disable-next-line no-cond-assign
    else if (extractedFromEmail = user.email?.split('@')[0]) {
      result = extractedFromEmail
    }

    return result
  }


}

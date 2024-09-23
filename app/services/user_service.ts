import User from '#models/user';
import hash from '@adonisjs/core/services/hash';
import { DateTime } from 'luxon'
import string from "@adonisjs/core/helpers/string";
// import db from '@adonisjs/lucid/services/db'

export default class UserService {
  async createUser(props: { email: string; password: string }) {
    return await User.create({
      email: props.email,
      password: props.password,
    })
  }

  async getUser(email: string) {
    return await User.findByOrFail('email', email)
  }

  // password-reset token expires after 2 hours
  tokenExpiryHours = 2

  // looks for user, via email, throws if not found
  // generates a token
  // sets the token field and expiry field
  // returns a token
  async setPasswordResetTokenFor(email: string) {
    const user = await this.getUser(email)
    if (!user) {throw new Error('user not found')}
    const token = string.generateRandom(64)
    user.password_reset_token = token
    user.password_reset_token_expiry = DateTime.local().plus({ hours: this.tokenExpiryHours })
    user.save()

    return token
  }

  tokenHasExpired(user: User | undefined) {
    return user ?
      user.password_reset_token_expiry
        ? user.password_reset_token_expiry < DateTime.local()
        : false
      : true // return true if no user
  }

  async getUserWithPasswordResetToken(
    token: string):
    Promise< { user: User | undefined, tokenHasExpired: boolean }>
  {
    let user
    try{
      user = await User.findByOrFail('password_reset_token', token)
     }
    catch(error){
      console.warn('no user found with specified password_reset_token', { token })
    }

    const tokenHasExpired = this.tokenHasExpired(user)
    return {
      user,
      tokenHasExpired
    }
  }

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
}

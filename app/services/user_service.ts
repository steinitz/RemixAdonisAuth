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

  tokenHasExpired(user: User | undefined) {
    return user ?
      user.password_reset_token_expiry
        ? user.password_reset_token_expiry < DateTime.local()
        : false
      : true // return true if no user
  }

  async getUserWithPasswordResetToken(token: string | undefined): Promise< { user: User | undefined, tokenHasExpired: boolean }> {
    // if (!token) return undefined
    const hashToken = await hash.make(token || '')
    console.log('getUserWithPasswordResetToken',{emailToken: token}, '\n', {hashToken})

    let user
    try{
      user = await User.findByOrFail('password_reset_token', hashToken)
      console.log(
        'getUserWithPasswordResetToken',
        {emailToken: hashToken}, {userToken: user?.password_reset_token}
      )
    }
    catch(error){
      console.warn('no user found with specified password_reset_token', { token })
      // testUser = await User.query().orderBy('id').first()
      console.log ('getUserWithPasswordResetToken', /* {testUserToken: testUser?.password_reset_token }*/)
    }

    const tokenHasExpired = this.tokenHasExpired(user)
    return {
      user,
      tokenHasExpired
    }
  }


  // looks for user, via email, throws if not found
  // generates a token
  // sets the token field and expiry field
  // returns a token
  async setPasswordResetTokenFor(email: string) {
    const user = await this.getUser(email)
    if (!user) {throw new Error('user not found')}
    const token = string.generateRandom(64);
    const hashToken = await hash.make(token)
    user.password_reset_token = hashToken
    user.password_reset_token_expiry = DateTime.local().plus({ hours: this.tokenExpiryHours })
    user.save()

    // return the unhashed token to use in the reset password link
    // because the hashed token isn't fit for appending to a url
    return token
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

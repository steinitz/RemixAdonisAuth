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

  async getUserWithPasswordResetToken(token: string | undefined): Promise<User | undefined> {
    // eslint-disable-next-line eqeqeq
    if (!token) return undefined
    const hashToken = await hash.make(token)
    console.log('getUserWithPasswordResetToken',{emailToken: token}, '\n', {hashToken})

    let user
    // let testUser
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

    return user /* || testUser */ || undefined
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
    user.password_reset_token_expiry = DateTime.local().plus({ hours: 2 })
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

import User from '#models/user';
import hash from '@adonisjs/core/services/hash';
import { DateTime } from 'luxon'
import string from "@adonisjs/core/helpers/string";

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

  // looks for user, via email, throws if not found
  // generates a token
  // sets the token field and expiry field
  // returns a token
  async setPasswordResetTokenFor(email: string) {
    const user = await this.getUser(email)
    if (!user) {throw new Error('user not found')}
    const token = string.generateRandom(64);
    user.password_reset_token = token

    user.password_reset_token_expiry = DateTime.local().plus({ hours: 2 })
    user.save()

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

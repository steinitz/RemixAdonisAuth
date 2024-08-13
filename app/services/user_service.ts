import User from '#models/user';
import hash from '@adonisjs/core/services/hash';

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

  async verifyPassword(user: User, password: string) {
    return hash.verify(user.password, password)
  }
}
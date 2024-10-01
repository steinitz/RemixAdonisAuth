import {DateTime} from 'luxon'
import hash from '@adonisjs/core/services/hash'
import {compose} from '@adonisjs/core/helpers'
import {BaseModel, column} from '@adonisjs/lucid/orm'
import {withAuthFinder} from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({isPrimary: true})
  declare id: number

  // not yet used
  @column()
  declare fullName: string | null

  // login credentials
  @column()
  declare email: string
  @column({serializeAs: null})
  declare password: string | null

  // password reset token
  @column()
  declare password_reset_token: string
  @column.dateTime({autoCreate: false})
  declare password_reset_token_expiry: DateTime | null

  // email confirmation token and status
  @column()
  declare email_confirmation_token: string
  @column.dateTime({autoCreate: false})
  declare email_confirmation_token_expiry: DateTime | null
  @column()
  declare is_email_confirmed: boolean

  // created and updated timestamps
  @column.dateTime({autoCreate: true})
  declare createdAt: DateTime
  @column.dateTime({autoCreate: true, autoUpdate: true})
  declare updatedAt: DateTime | null
}

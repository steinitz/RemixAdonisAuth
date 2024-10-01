import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email_confirmation_token', 128).nullable().unique()
      table.timestamp('email_confirmation_token_expiry').nullable()
      table.boolean('is_email_confirmed').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

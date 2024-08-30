import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('password_reset_token',128).nullable().unique()
      table.timestamp('password_reset_token_expiry').nullable()

  })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

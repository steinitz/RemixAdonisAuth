import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username', 64).nullable().unique()
      table.string('preferred_name', 64).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

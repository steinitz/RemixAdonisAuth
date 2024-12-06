import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env'

const nodeEnvironment = env.get('NODE_ENV') || 'development'
const sqliteFilepath = env.get('SQLITE3_FILEPATH')
console.log('database', {sqliteFilepath})
const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: "better-sqlite3",
      connection: {
        filename: nodeEnvironment === 'production' ?
          sqliteFilepath ?? app.tmpPath('db.sqlite3') :
          app.tmpPath('db.sqlite3')
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig

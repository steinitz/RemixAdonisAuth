/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .any('*', async ({ remixHandler }) => {
    return remixHandler()
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

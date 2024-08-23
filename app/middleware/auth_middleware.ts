import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  // The URL to redirect to, when authentication fails
  redirectTo = '/login'

  openRoutes = [
    this.redirectTo, '/',
    this.redirectTo, '/register',
    this.redirectTo, '/request-password-reset',
    this.redirectTo, '/password-reset-email-sent',
  ]

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    if (this.openRoutes.includes(ctx.request.parsedUrl.pathname ?? '')) {
      return next()
    }
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}

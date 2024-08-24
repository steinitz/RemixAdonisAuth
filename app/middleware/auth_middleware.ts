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
    // if we include the following line then the _index page loader function can't
    // access logged in user email address via context.http.auth.user?.email
    // '/',
    this.redirectTo, // login
    '/register',
    '/reset-password-request',
    '/reset-password-email-sent',
    '/reset-password/$token',
  ]

  async handle(
    ctx: HttpContext,
    next: NextFn, // promise
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    // const pathname = ctx.request.parsedUrl.pathname ?? ''
    // console.log('auth_middleware', {pathname}, ctx.request)
    // if (!this.openRoutes.includes(pathname ?? '')) {
    if (ctx.request.matchesRoute(this.openRoutes)) {
      console.log('didn\'t find the route in openRoutes')
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    }
    return next()
  }

}

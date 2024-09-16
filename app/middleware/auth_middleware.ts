import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  loginPage = '/login'

  // Note that the Adonis string, ctx.route.pattern, used by matchesRoute(),
  // is always '/*' when we delegate the routing to Remix.  So we can't use
  // matchesRoute() here.
  openRoutes = [
    '/*',
    this.loginPage,
    '/register',
    '/reset-password-request',
    '/reset-password-email-sent',
    '/reset-password/'
  ]

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const pathname = ctx.request.parsedUrl.pathname
    // console.log('AuthMiddleware', {pathname: pathname})
    const isOpenRoute = this.openRoutes.includes(pathname ?? '')
    if (isOpenRoute) {
      console.log(`auth_middleware: found ${pathname} in openRoutes`)
    }
    else {
      console.log(`auth_middleware: did not find ${pathname} in openRoutes`)
      await ctx.auth.authenticateUsing(options.guards, {loginRoute: this.loginPage})
    }

    return next()
  }
}

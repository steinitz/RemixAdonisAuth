import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { wildcardCompare } from '#remix_app/utilities/wildcardCompare'
/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */


export default class AuthMiddleware {
  loginRoute = '/login'

  // Note that the Adonis string, ctx.route.pattern, used by matchesRoute(),
  // is always '/*' when we delegate the routing to Remix.  So we can't use
  // matchesRoute() here.
  openRoutes = [
    '/',
    `${this.loginRoute}`,
    '/register',
    '/reset-password-request/*',
    '/reset-password-email-sent',
    '/reset-password/*'
  ]

  isOpenRoute (route: string | undefined | null) {
    if (!route) return false

    const matchedRoutes = this.openRoutes.filter(
      aRoute => wildcardCompare(route || '', aRoute)
    )
    return matchedRoutes.length > 0
  }

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const pathname = ctx.request.parsedUrl.pathname
    const isOpenRoute = this.isOpenRoute(pathname)
    if (isOpenRoute) {
      // console.log(`auth_middleware: found ${pathname} in openRoutes`)
    }
    else {
      // console.log(`auth_middleware: did not find ${pathname} in openRoutes`)
      await ctx.auth.authenticateUsing(options.guards, {loginRoute: this.loginRoute})
    }

    return next()
  }
}

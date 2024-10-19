import { routeStrings } from '#remix_app/constants';
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node'
import {
  useLoaderData,
  Form,
} from "@remix-run/react";
import {UserBlock} from "#remix_app/components/userBlock";

export const meta: MetaFunction = () => {
  return [
    {title: 'Weekend Trading System'},
    {name: 'weekend-trading-system', content: 'Weekend is Non-Representative Trading System'},
  ]
}

export const action = async ({context}: ActionFunctionArgs) => {
  const {http} = context
  const {intent} = http.request.only(['intent'])
  console.log({intent})
  if (intent === 'log_out') {
    await http.auth.use('web').logout()
    return redirect(routeStrings.login)
  }
  if (intent === 'log_in') {
    return redirect(routeStrings.login)
  }
  return null
}

export const loader = async ({context}: LoaderFunctionArgs) => {
  const auth = context.http.auth

  // The doc says I only have to do this on unauthenticated routes
  await auth.check()

  const user = auth.user
  const email = user?.email

  return json({
    email,
  })
}

export default function Page() {
  const {email} = useLoaderData<typeof loader>()
  // dubious tweak to align the login button and loggedin text
  const loggedInButtonFormTopMarginTweak = '-21px'

  // console.log('index page', {email})
  return (
    <main>
      <nav>
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'center',
          }}
        >
          <h3 style={{}}>Blockchain Portfolio, built with Remix & Adonis</h3>
          <div style={{}}>
            {email ?
              <UserBlock email={email}/>
              :
              <Form style={{
                border: 'none',
                boxShadow: 'none',
                textAlign: 'right',
                marginTop: loggedInButtonFormTopMarginTweak,
              }} method="POST">
                <input type="hidden" name="intent" value={'log_in'} />
                <button style={{}} type={'submit'}>Login</button>
              </Form>
            }
          </div>
        </div>
      </nav>
      <section>
        {/*<button type="submit">Add Accounts and Wallets</button>*/}
        <ul>
          <li>
            <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
              Remix Docs
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
              Tutorial: Remix 15m Quickstart Blog
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/jokes"
              rel="noreferrer"
            >
              Tutorial: Remix Deep Dive Jokes App
            </a>
          </li>
          <li>
            <a target="_blank" href="https://docs.adonisjs.com" rel="noreferrer">
              Adonis Docs
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://adocasts.com/?utm_source=docs.adonisjs.com"
              rel="noreferrer"
            >
              Adonis Screencasts
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix-adonisjs.matstack.dev/" rel="noreferrer">
              Tutorial: Combine AdonisJS with RemixJS and Add Authentication Flow
            </a>
          </li>
          <li>
            <a target="_blank" href="https://andybrewer.github.io/mvp/" rel="noreferrer">
              MVP.CSS - class-less CSS file to style semantic HTML
            </a>
          </li>
        </ul>
      </section>
    </main>
  )
}



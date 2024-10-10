import {
  type ActionFunctionArgs, json, type LoaderFunctionArgs, type MetaFunction, redirect,
} from '@remix-run/node'
import {Form, useLoaderData} from '@remix-run/react'
import {hideFormBorder} from "~/components/styles";
import {UserBlock} from "~/components/userBlock";

export const meta: MetaFunction = () => {
  return [
    {title: 'Weekend Trading System'},
    {name: 'weekend-trading-system', content: 'Weekend is Non-Representative Trading System'},
  ]
}

export const action = async ({context}: ActionFunctionArgs) => {
  const {http} = context
  const {intent} = http.request.only(['intent'])
  // console.log({intent})
  if (intent === 'log_out') {
    await http.auth.use('web').logout()
    return redirect('/')
  }
  if (intent === 'log_in') {
    return redirect('/login')
  }
  return null
}

// export const loader = async ({context}: LoaderFunctionArgs) => {//   const service = await context.make('hello_service')

//   return json({//     message: service.getMessage(),
//   })
//}

export const loader = async ({context}: LoaderFunctionArgs) => {
  const auth = context.http.auth

  // for non-authenticated routes the logged-in user won't
  // be available until we call auth.check()
  await auth.check()

  // now we can get the email of the logged-in user, if any
  const email = auth.user?.email

  return json({
    email,
  })
}


export default function Index() {
  const {email} = useLoaderData<typeof loader>()

  // console.log('index page', {email})
  return (
    <main>
      <nav>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'center',
          }}
        >
          <h3>Blockchain Portfolio, built with Remix & Adonis</h3>
          <div>
          {
            email ?
            // some nasty tweaks to align the login button and loggedin text
            <UserBlock email={email}/>
            :
            <Form method="POST" style={hideFormBorder} >
              <input type="hidden" name="intent" value={'log_in'}/>
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



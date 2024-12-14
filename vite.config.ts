import {vitePlugin as remix} from '@remix-run/dev'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig((/*{ isSsrBuild }*/) => {
  const result = {

    // base: '/', Not needed; temporarily added to troubleshoot the CSS MIME error

    plugins: [
      remix({
        appDirectory: 'resources/remix_app',
        buildDirectory: 'build/remix',
        serverBuildFile: 'server.js',
      }),
      tsconfigPaths(),
    ],
    optimizeDeps: {
      esbuildOptions: // isSsrBuild ?
        {
          // target: 'esnext',
          target: 'ES2022',
        //}

        // SJS - added esnext target to allow top-level await but it might give
        // a runtime error in a production build.  I'll keep it here, commented
        // out to remind me of how it works.
        // The source of the change had this comment:
        // "This allows me to use top-level await in server code while
        // not messing with browser code."

        // This is now solved in the esbuild section below

          // target: 'ES2022',
        },
    },

    // SJS - added this to avoid top-level await errors in production build
    // note - apparently, the supported option can also go in the
    // esbuildOptions, above, but it's fiddley because of the ternary
    esbuild: {
      supported: {
        'top-level-await': true // browsers can handle top-level-await features
      },
    },
      css: {
      postcss: {
        plugins: [], // Add any PostCSS plugins here (optional)
      },
    },
  }
  return result;
})

import {vitePlugin as remix} from '@remix-run/dev'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => {
  // console.log({isSsrBuild})
  return {
  base: '/assets/',
  plugins: [
    remix({
      appDirectory: 'resources/remix_app',
      buildDirectory: 'build/remix',
      serverBuildFile: 'server.js',
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    esbuildOptions: isSsrBuild ?
      {
        target: 'ES2022',
      }
      // SJS - added esnext target for reasons forgotten but it gives
      // a runtime error in a production build.  I'll keep it here
      // for now in case I remember why I added it.
      : {
        // target: 'esnext',
        target: 'ES2022',
      },
  },
}})

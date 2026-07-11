import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { loadResume, resumePath, summaryPath, skillsPath } from './scripts/load-resume.mjs'

async function renderResume(server) {
  const resume = loadResume()
  const { render } = await server.ssrLoadModule('/theme/index.js')
  return render(resume)
}

export default defineConfig({
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'resume-dev-server',
      configureServer(server) {
        server.watcher.add([resumePath, summaryPath, skillsPath])
        server.watcher.on('change', file => {
          if (file === resumePath || file === summaryPath || file === skillsPath) {
            server.ws.send({ type: 'full-reload' })
          }
        })

        server.middlewares.use(async (req, res, next) => {
          if (req.url !== '/') return next()
          try {
            const html = await renderResume(server)
            const transformed = await server.transformIndexHtml(req.url, html)
            res.setHeader('Content-Type', 'text/html')
            res.end(transformed)
          } catch (e) {
            server.ssrFixStacktrace(e)
            next(e)
          }
        })
      },
      handleHotUpdate({ file, server }) {
        if (file.startsWith(resolve('theme') + '/') && !file.includes('/theme/dist/')) {
          server.ws.send({ type: 'full-reload' })
          return []
        }
      },
    },
  ],
})

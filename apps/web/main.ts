import bodyParser from 'body-parser';
import express from 'express'
import { build as esbuild } from 'esbuild'
import { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (request, response) => {
  const root = await import('./dist/root.js')
  const node = createElement(root.default.default)

  // Stream the data to make it even faster!
  const { pipe } = renderToPipeableStream(node, {
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
})

const build = async () => {
  await esbuild({
    bundle: true,
    format: 'esm',
    logLevel: 'error',
    packages: 'external',
    entryPoints: ['src/root.tsx'],
    outdir: 'dist'
  })
}

const PORT = 3002


const server = app.listen(PORT, async () => {
  await build()
  const serverAddress = server.address()
  const port = typeof serverAddress === 'string' || serverAddress === null ? PORT : serverAddress.port
  process.stdout.write(`Listening at http://localhost:${port}\n`)
});


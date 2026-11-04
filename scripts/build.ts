/** Compile self-contained Client factories and ESM Host entries without a DSH source checkout. */
import { build } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const require = createRequire(import.meta.url)
const licenses: string[] = []
for (const dependency of ['lucide-react', 'zod']) {
  const directory = dirname(require.resolve(`${dependency}/package.json`))
  licenses.push(`${dependency}\n\n${await readFile(join(directory, 'LICENSE'), 'utf8')}`)
}
const license = await readFile(new URL('LICENSE', root), 'utf8')
for (const kind of ['movies', 'music', 'photos', 'files']) {
  const directory = new URL(`packages/desktop-${kind}/`, root)
  const manifest: { name: string } = JSON.parse(await readFile(new URL('package.json', directory), 'utf8'))
  await build({
    entryPoints: [fileURLToPath(new URL('src/index.ts', directory))],
    outfile: fileURLToPath(new URL('lib/index.js', directory)), format: 'esm', platform: 'node', target: 'es2022',
  })
  await build({
    entryPoints: [fileURLToPath(new URL('src/client.ts', directory))],
    outfile: fileURLToPath(new URL('lib/client.js', directory)), bundle: true, format: 'cjs',
    platform: 'browser', target: 'es2022', jsx: 'automatic', minify: true,
    external: ['react', 'react/jsx-runtime'], loader: { '.css': 'text' },
    banner: { js: `window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory(require){const module={exports:{}};const exports=module.exports;` },
    footer: { js: 'return module.exports;}});' },
  })
  await writeFile(new URL('lib/THIRD_PARTY_NOTICES.txt', directory), licenses.join('\n\n') + '\n')
  await writeFile(new URL('lib/LICENSE.txt', directory), license)
  console.log(`built ${manifest.name}`)
}

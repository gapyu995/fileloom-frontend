// @vitest-environment node
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import type { PluginContext } from '../shared/protocol.ts'

interface Registration {
  id: string
  factory: (require: NodeJS.Require) => { apply: (ctx: PluginContext) => void; inject: string[] }
}

describe('built Client factories', () => {
  it.each(['movies', 'music', 'photos', 'files'])('loads and reverses %s contributions without another React or a source checkout', kind => {
    const file = new URL(`../packages/desktop-${kind}/lib/client.js`, import.meta.url)
    let registration: Registration | undefined
    runInNewContext(readFileSync(file, 'utf8'), {
      window: { location: { origin: 'https://files.example' }, __ModuleLoader__: { load: (value: Registration) => { registration = value } } }, URL,
    })
    if (registration === undefined) throw new Error('factory did not register')
    expect(registration.id).toBe(`@fileloom/desktop-${kind}`)
    const requested: string[] = []
    const require = createRequire(import.meta.url)
    const values = registration.factory(Object.assign((name: string) => { requested.push(name); return require(name) }, require))
    expect(values.inject).toEqual(['slots', 'locale', 'layout', 'theme'])
    expect(requested.every(name => name === 'react' || name === 'react/jsx-runtime')).toBe(true)
    const entries = new Set<string>()
    const namespaces = new Set<string>()
    const cleanup: Array<() => void> = []
    const ctx: PluginContext = {
      effect: callback => { cleanup.push(callback()) },
      layout: { panelInfo: { getSnapshot: () => ({ activePanelId: null }), subscribe: () => () => {} } },
      theme: { overrideTokens: () => () => {} },
      locale: {
        register: namespace => { namespaces.add(namespace); return () => { namespaces.delete(namespace) } },
        bind: () => key => key,
      },
      slots: {
        inject: (_slot, callback) => { cleanup.push(callback()) },
        register: options => {
          const key = `${options.name}/${options.key ?? options.id}`
          entries.add(key)
          return () => { entries.delete(key) }
        },
      },
    }
    values.apply(ctx)
    expect(entries.size).toBe(2)
    expect(namespaces.size).toBe(1)
    for (const dispose of cleanup.reverse()) dispose()
    expect(entries.size).toBe(0)
    expect(namespaces.size).toBe(0)
  })
})

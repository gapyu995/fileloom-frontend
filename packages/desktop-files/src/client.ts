/** Independently loadable files desktop. */
import { mountDesktop } from '../../../shared/plugin.ts'
import type { PluginContext } from '../../../shared/protocol.ts'

export const name = 'fileloom-files'
export const inject = ['slots', 'locale']

/** Register this desktop and its reversible locale and slot contributions. */
export function apply(ctx: PluginContext): void { mountDesktop(ctx, 'files') }

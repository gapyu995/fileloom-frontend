/** Independently loadable photos desktop. */
import { mountDesktop } from '../../../shared/plugin.ts'
import type { PluginContext } from '../../../shared/protocol.ts'

export const name = 'fileloom-photos'
export const inject = ['slots', 'locale', 'layout', 'theme']

/** Register this desktop and its reversible locale and slot contributions. */
export function apply(ctx: PluginContext): void { mountDesktop(ctx, 'photos') }

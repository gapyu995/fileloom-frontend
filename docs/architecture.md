# Architecture and Migration

## Status

This document is a proposal, not a description of shipped functionality. The current implementation remains in Fileloom. No package names, package exports, registry API, or installation command are promised by this repository yet.

## Proposed Package Organization

`packages/` will contain separately loadable Client plugins for movies, music, photos, and general files. Each plugin will own its source, locale dictionaries, styles, tests, and assets. Shared code will be extracted only after implemented consumers establish a common need; a generic plugin manager or media framework is not required up front.

Each plugin will register UI contributions through DSH's existing slots and reversible effects. Unloading a plugin must remove its registrations and stop its own playback, timers, listeners, and pending requests. Client state must belong to the plugin instance rather than a module-level active desktop singleton.

## Host Responsibilities

The Fileloom Host remains authoritative for data roots, path validation, authenticated content access, durable metadata, file mutation, snapshots, and rollback. Browser views call authenticated Host APIs. A presentation mode must not change the permissions of the same file operation.

Movies need deliberate support for browser-compatible playback, content ranges, posters, metadata, and progress persistence. Music needs metadata and queue/playback decisions. Photos need a thumbnail strategy and date metadata. These dependencies must be designed and tested with the Host before the corresponding controls are presented as working features. The existing generic preview endpoint is not a promise of media streaming or transcoding support.

## Migration Acceptance

- The existing UI builds without importing source scripts from a sibling DSH checkout.
- The plugin resolves supported DSH dependencies and is loadable by the actual Fileloom profile.
- Locale dictionaries, theme tokens, styles, and assets survive loading and disposal.
- Fileloom consumes a pinned revision or published version; it does not maintain a copied frontend tree.
- Unit tests, existing UI expectations, and browser verification pass against the real Host.
- Standalone development does not create another supported production application launcher.

The old UI is removed from Fileloom only in the change that activates the verified replacement. Backend APIs, `data_steward_*` tools, persistent file state, and configured data roots are not renamed by this migration.

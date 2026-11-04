# Frontend Architecture

## Ownership

`packages/desktop-movies`, `desktop-music`, `desktop-photos`, and `desktop-files` are independently mountable plugins. `shared/` contains source compiled privately into each browser factory: the authenticated read API, validation, locale copy, navigation, and previews. No runtime shared-state service or global active-desktop singleton is created.

Each package exports an inert ESM Host entry and a `./client` artifact. The browser artifact registers a lazy `window.__ModuleLoader__.load({ id, factory })` factory with the package's exact id. It obtains React from the host module table, not a bundled second React. There are no imports of private DSH feature components or source-build scripts.

`shared/protocol.ts` describes only the locale, effect, slot, panel-selection, and theme operations these plugins consume. It is an adapter for the tested Fileloom version, not a general DSH SDK. The integration overlay resolves each Host entry by path; DSH discovers its nearest package manifest and corresponding Client artifact.

## Lifecycle

Each desktop owns its locale namespace and two slot registrations. Locale registration runs through `ctx.effect`; slot registration runs through `ctx.slots.inject`. State belongs to the mounted desktop. Effects abort root, list, and text-preview requests; stale completions cannot replace a newer navigation. Switching roots remounts folder state. Leaving a preview pauses media and removes its source.

Plugin disposal removes its registrations and unmounts its UI. `tests/bundles.spec.ts` checks the factory and cleanup adapter; real-profile browser verification is a separate integration check and must not be inferred from that adapter test.

Each plugin subscribes to `layout.panelInfo` from its apply function. Only the selected desktop adds a reversible `theme.overrideTokens` layer, and disposal removes both the subscription and the layer. Cinema applies paired dark values for the shell surfaces, text, borders, and buttons; other desktops override only the sidebar fill with light/dark pairs. The user's saved theme preference is never written. Unrelated panels inherit their previous theme after navigation.

## Media State

`shared/views/` contains separate video, photo, and music compositions. Video shelves derive from the current folder. The featured title and artwork are actual file values; a same-stem image is optional. `Preview` reports bounded playback progress on time updates, pause, completion, and teardown.

`shared/preferences.ts` validates a versioned localStorage record per media kind and data root. Watchlists/favorites store relative paths; video progress stores path, size, and modification time together so replacement files cannot inherit old resume points. Records are bounded to 2,000 saved paths and 100 resume points. Storage failure is visible and retains the current in-memory choice. This is browser preference data, not a Host index or server-synchronized media database.

Photo collections group file modification dates by local calendar month or year. Selection is transient; favorites are browser-local. A native modal provides focus containment, Escape, keyboard previous/next, zoom, and a thumbnail filmstrip. No EXIF date, face, location, or cloud library is inferred.

Music owns an explicit queue of file records. Filtering changes the visible list without replacing playback. Starting a track list replaces the queue; play-next, removal, shuffle, and repeat operate on that queue. A keyed player owns its audio element and stops/reloads it on disposal. Volume and mute belong to the desktop so they survive track changes. The native play promise determines failure reporting; a rejected play is not displayed as successful playback.

## Host Responsibilities

Fileloom Host remains authoritative for roots, path validation, authentication, directory contents, mutations, snapshots, and rollback. These desktops issue only GET requests to `/api/file-manager/roots`, `/list`, and `/content` on the page's own origin. Returned roots and list fields are validated with Zod. Authentication, transport, and invalid-response failures are localized categories, not raw server diagnostics.

Folder filters are presentation logic, not authorization or classification policy. Direct filesystem access, unconfirmed mutations, and a second application launcher are not part of this repository.

## Remaining Work

The Fileloom management plugin is not moved or copied here. It continues to own uploads, organization, trash, rules, and history. A future replacement must build independently, be verified against the actual Host, and remove the old maintained source in the same change that activates the replacement.

Full media support needs separate Host capabilities: Range-aware content access, transcoding decisions, metadata, thumbnails, and server-side preference persistence. Current controls do not promise those capabilities. npm publication and pinned production consumption remain separate release work; the delivered integration uses a built sibling checkout.

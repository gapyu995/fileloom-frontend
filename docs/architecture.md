# Frontend Architecture

## Ownership

`packages/desktop-movies`, `desktop-music`, `desktop-photos`, and `desktop-files` are independently mountable plugins. `shared/` contains source compiled privately into each browser factory: the authenticated read API, validation, locale copy, navigation, and previews. No runtime shared-state service or global active-desktop singleton is created.

Each package exports an inert ESM Host entry and a `./client` artifact. The browser artifact registers a lazy `window.__ModuleLoader__.load({ id, factory })` factory with the package's exact id. It obtains React from the host module table, not a bundled second React. There are no imports of private DSH feature components or source-build scripts.

`shared/protocol.ts` describes only the locale, effect, and slot operations these plugins consume. It is an adapter for the tested Fileloom version, not a general DSH SDK. The integration overlay resolves each Host entry by path; DSH discovers its nearest package manifest and corresponding Client artifact.

## Lifecycle

Each desktop owns its locale namespace and two slot registrations. Locale registration runs through `ctx.effect`; slot registration runs through `ctx.slots.inject`. State belongs to the mounted desktop. Effects abort root, list, and text-preview requests; stale completions cannot replace a newer navigation. Switching roots remounts folder state. Leaving a preview pauses media and removes its source.

Plugin disposal removes its registrations and unmounts its UI. `tests/bundles.spec.ts` checks the factory and cleanup adapter; real-profile browser verification is a separate integration check and must not be inferred from that adapter test.

## Host Responsibilities

Fileloom Host remains authoritative for roots, path validation, authentication, directory contents, mutations, snapshots, and rollback. These desktops issue only GET requests to `/api/file-manager/roots`, `/list`, and `/content` on the page's own origin. Returned roots and list fields are validated with Zod. Authentication, transport, and invalid-response failures are localized categories, not raw server diagnostics.

Folder filters are presentation logic, not authorization or classification policy. Direct filesystem access, unconfirmed mutations, and a second application launcher are not part of this repository.

## Remaining Work

The Fileloom management plugin is not moved or copied here. It continues to own uploads, organization, trash, rules, and history. A future replacement must build independently, be verified against the actual Host, and remove the old maintained source in the same change that activates the replacement.

Full media support needs separate Host capabilities: Range-aware content access, transcoding decisions, metadata, thumbnails, and progress persistence. Current controls do not promise those capabilities. npm publication and pinned production consumption remain separate release work; the delivered integration uses a built sibling checkout.

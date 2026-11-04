# Fileloom Frontend

Independent DSH Client plugins for browsing a Fileloom library. Each desktop has its own package, Host entry, browser factory, locale registration, and sidebar/main-panel contributions. File mutations remain in Fileloom's existing management plugin.

## Desktops

| Package | Current behavior |
|---|---|
| `@fileloom/desktop-movies` | Video-file grid, folders, bounded native preview for MP4/WebM |
| `@fileloom/desktop-music` | Track list, a folder-scoped queue, native audio controls, previous/next |
| `@fileloom/desktop-photos` | Image grid, newest-first sorting, large preview, previous/next |
| `@fileloom/desktop-files` | General file list, folders, local filtering, text/PDF/media preview |

All desktops support data-root switching, breadcrumbs, sorting, filtering the current folder, refresh, error recovery, English/Chinese copy, and narrow viewports. They are read-only and do not scan, classify, upload, move, or delete files.

## Build and Test

Requires Node.js 22.19+ and pnpm 11.28.5. Dependencies resolve independently from npm; no DSH source code or internal build script is imported.

```sh
pnpm install --frozen-lockfile
pnpm check
```

`check` type-checks, builds all four plugins, and runs unit, UI, built-factory, and disposal-adapter tests. Browser code requests only the host's shared React and JSX runtime. Lucide icons and Zod validation are bundled privately. No application server is implemented here; DSH profiles remain the production launcher.

## Use in Fileloom

The current integration is a source-checkout overlay, not an npm release. Keep this repository beside the `fileloom` checkout, build the plugins, then run this command from Fileloom:

```sh
pnpm dsh web --patch apps/web/tests/pin-browse-picker.overlay.yml --patch apps/cli/config/examples/fileloom-frontend/desktop.cordis.patch.yml --no-open
```

The picker overlay selects DSH's in-page directory picker. The desktop overlay mounts all four built Host entries; their manifests advertise the matching browser factories. Remove individual desktop rows to opt out. No DSH core or shared client package needs modification.

Compatibility is currently verified against the Fileloom development checkout, not every published DSH release. See [architecture](docs/architecture.md) for lifecycle and migration responsibilities.

## Limits

- Fileloom's current content endpoint limits previews to 64 MB and has no Range streaming or transcoding. Large movie playback is not supported.
- Image tiles lazily load original images within that limit; no thumbnail service is claimed.
- Movie posters, album/artist metadata, EXIF timelines, recursive media libraries, durable queues, and viewing-progress synchronization are not implemented.
- A music queue contains visible files in the current folder; leaving the desktop or switching roots stops playback. Unsupported codecs display an unavailable-preview state.
- General-file browsing complements the management panel; it is not a copied version of the upload/organization/trash UI.
- The local Client-service type adapter is verified with Fileloom's real Loader; it is not a replacement SDK or cross-version compatibility guarantee.

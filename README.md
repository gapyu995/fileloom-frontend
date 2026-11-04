# Fileloom Frontend

Independent DSH Client plugins for browsing a Fileloom library. Each desktop has its own package, Host entry, browser factory, locale registration, and sidebar/main-panel contributions. File mutations remain in Fileloom's existing management plugin.

## Desktops

| Package | Current behavior |
|---|---|
| `@fileloom/desktop-movies` | Cinema-style featured video, horizontal shelves, watchlist, bounded MP4/WebM playback, browser-local resume |
| `@fileloom/desktop-music` | Folder library, editable queue, sticky player, seeking, volume, shuffle, repeat, previous/next |
| `@fileloom/desktop-photos` | All/month/year collections, adjustable grid, bulk favorites, keyboard lightbox, filmstrip and zoom |
| `@fileloom/desktop-files` | General file list, folders, local filtering, text/PDF/media preview |

All desktops support data-root switching, breadcrumbs, sorting, filtering the current folder, refresh, error recovery, English/Chinese copy, and narrow viewports. They are read-only and do not scan, classify, upload, move, or delete files.

The sidebar follows the selected desktop through a temporary DSH theme layer. Video uses a dark cinema palette, photos/files use neutral colors, and music uses a muted green tint. Switching away or unloading a plugin restores the underlying theme without changing saved appearance settings. Photos, music, and files retain the user's system light/dark choice.

Video artwork comes only from a real same-stem image in the current folder, such as `Trip.mp4` with `Trip.jpg`. Music uses a folder's `cover.jpg`/`.jpeg`/`.png`/`.webp` or a same-stem track image. Missing artwork uses an icon rather than an invented poster. Titles come from filenames; displayed dates are file modification dates, not release or capture metadata.

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
- Online poster lookup, album/artist metadata, EXIF capture timelines, recursive media libraries, and server-synchronized preferences are not implemented.
- Watchlists, favorites, and video resume positions are local to this browser and data root. Replaced files do not reuse old resume positions. Storage failures leave choices in memory and show a warning; clearing site storage removes these preferences.
- Music queues are in memory. Filtering does not replace an active queue, but starting a new track list does. Leaving the desktop, folder, or data root stops playback and clears it. Queues are not durable or synchronized.
- The playback limit remains 64 MB. Unsupported codecs display an unavailable-preview state. Repeat and shuffle operate on the explicit queue, not on hidden or recursively discovered files.
- General-file browsing complements the management panel; it is not a copied version of the upload/organization/trash UI.
- The local Client-service type adapter is verified with Fileloom's real Loader; it is not a replacement SDK or cross-version compatibility guarantee.

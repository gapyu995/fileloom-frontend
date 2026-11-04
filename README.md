# Fileloom Frontend

Frontend plugin development for [Fileloom](https://github.com/gapyu995/fileloom), built around DeepSeek Harness (DSH) and Cordis plugins.

## Status

This public repository currently contains the frontend architecture and migration plan only. It does not yet contain an installable plugin, independent build, or working media desktops. The current file-management UI remains in the Fileloom repository under `packages/file-manager/ui-file-manager/` until standalone build and loading verification are complete. There is no duplicated frontend source here.

## Planned Desktops

| Desktop | Intended interaction |
|---|---|
| Movies | Poster library, movie details, playback, and viewing progress |
| Music | Albums, artists, playback queue, and player controls |
| Photos | Thumbnail grid, large-image inspection, and date navigation |
| Files | Folder navigation, list/grid display, search, and document preview |

Each desktop is intended to be an independently mounted DSH Client plugin. A shared frontend package will be introduced only for functionality that multiple implemented desktops actually need. Playback and metadata features require matching host APIs; the current backend must not be assumed to provide them.

## Ownership

- Fileloom Host owns filesystem access, validation, permissions, indexing, classification, snapshots, and reversible operations.
- This repository will own frontend navigation, rendering, client interaction, and media-specific presentation.
- DSH owns application launch, plugin loading, authentication, locale services, theme tokens, and slots.

No frontend package may access local files directly or bypass host confirmation and path checks. Production launch stays under a DSH profile rather than a new application executable.

## Next Steps

1. Verify the existing UI against independently resolved DSH dependencies and build tooling.
2. Move that UI here without keeping a second maintained copy in Fileloom.
3. Connect Fileloom to a pinned plugin version through its bundle configuration.
4. Implement and test each media desktop with its required Host APIs.

See [Architecture and Migration](docs/architecture.md).

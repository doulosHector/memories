# Memories

**Recuerdos** is a small app to log the important events in your life and
see how much time has passed since each one, built as an offline-first
**PWA**. The UI is in Spanish.

All data is stored **only on the device**: the events in `localStorage` and
their photos in IndexedDB. There is no backend and no account.

## Features

- **Events**: name, date, optional description and optional photo (resized
  to at most 1600px and saved as JPEG).
- **Counters**: time since each event in years, months and days, days until
  its next anniversary (Feb 29 events celebrate on Feb 28 in non-leap
  years), and days until events with a future date.
- **List** sorted by the closest upcoming anniversary, with a highlight on
  the day itself.
- **Detail** view with the photo, both counters, edit and delete.
- **Light/dark theme** that follows the system until you pick one.
- **PWA**: installable, works offline, updates automatically.

## Tech stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript (strict)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) (Workbox service worker + web manifest)
- [Vitest](https://vitest.dev) for unit tests
- [oxlint](https://oxc.rs) for linting and [Prettier](https://prettier.io) for formatting
- Self-hosted [Fraunces](https://fontsource.org/fonts/fraunces) and
  [Inter](https://fontsource.org/fonts/inter) variable fonts

## Getting started

Requires Node.js 22+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

### Scripts

| Script                        | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `npm run dev`                 | Start the dev server                                 |
| `npm run build`               | Type-check and build for production into `dist/`     |
| `npm run preview`             | Serve the production build locally                   |
| `npm test`                    | Run unit tests (`npm run test:watch` for watch mode) |
| `npm run lint`                | Lint with oxlint                                     |
| `npm run typecheck`           | Type-check without building                          |
| `npm run format`              | Format all files with Prettier                       |
| `npm run generate-pwa-assets` | Regenerate the PWA icons from `public/favicon.svg`   |

## Project structure

```text
src/
├── app/            # App shell: providers, layout composition, sheet outlet
├── components/
│   ├── layout/     # Header with the theme toggle
│   └── ui/         # Reusable UI: icons, sheet, toast, empty state
├── constants/      # Icons, month names, theme colors
├── context/        # React contexts: memories store, UI state, toasts
├── features/
│   └── memories/   # List, cards, form and detail sheets
├── hooks/          # Shared hooks: photo URLs, today, document theme
├── services/       # Memory summaries, localStorage and the photo store
├── styles/         # Design tokens and global styles
├── test/           # Test factories
├── types/          # Domain and UI types
└── utils/          # Generic helpers: dates, formatting, images, ids
```

- **State** lives in a reducer (`context/memories`) and is saved to
  `localStorage` (key `memories:v1`) on every change. Stored data is
  validated when loaded.
- **Photos** are stored as Blobs in IndexedDB (database `memories`, store
  `photos`) because they are too big for `localStorage`. If IndexedDB is not
  available they are kept in memory until the page is closed.
- **Business logic** (elapsed time, anniversaries, sort order) is kept in
  pure functions under `utils/` and `services/` so it is easy to test.
- **Styles** use CSS custom properties for theming; each component or
  feature imports its own stylesheet.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` lints, tests, builds and
deploys the app on every push to `main`.

1. Create a GitHub repository and push this project to `main`.
2. In the repository, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The app will be available at `https://<user>.github.io/<repo>/`. The base
path is detected automatically in CI; to build for a sub-path locally, set
`BASE_PATH`:

```bash
BASE_PATH=/memories/ npm run build
```

## Moving data from the single-file version

The original `Momentos` HTML page was a Claude artifact: it saved events and
photos in the artifact's own cloud storage, and it had no export option. So
there is no file to import here. Add your events again with **Añadir
evento** (photos can be picked again from your gallery).

Keep in mind that this app keeps everything on one device and browser. Clearing
the site data, or uninstalling the app, deletes your events.

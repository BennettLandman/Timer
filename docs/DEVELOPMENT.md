# Developing Timer

Timer is a static JavaScript application using Canvas 2D, WebGL 2, and Web Audio. Its Three.js runtime is bundled locally. There are no package dependencies to install and no backend to run.

## Local setup

From the repository root, start a static server with Python 3:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in a browser with WebGL 2 enabled. JavaScript modules require HTTP rather than a `file:` URL. Allow the assets to load before starting a timer.

## Build and publish

Use Node.js 18 or newer; the GitHub Actions workflow uses Node.js 24.

```sh
npm test
npm run build
```

The build hashes the homepage and runtime files, copies `src/` into `dist/src/<content-hash>/`, and rewrites the stylesheet and entry-module paths in `dist/index.html`. Relative imports keep the complete runtime in that versioned directory, preventing stale browser modules from mixing across deployments. Serve that directory to preview the production site. Pushes to `main` run the unit checks and publish `dist/` to GitHub Pages. See the [hosting guide](../HOSTING.md) for deployment and release packaging.

## Browser checks

Browser checks require Playwright, Chrome, and the local server at port 8080. Set `PLAYWRIGHT_PATH` to an installed Playwright package if it is not available through normal module resolution. `CHROME_PATH` can select a Chrome executable; the default on macOS is the installed Google Chrome application.

```sh
npm run test:browser
npm run test:gaits
npm run test:rig
npm run test:performance
npm run test:mindfulness
npm run test:homepage-preview
npm run test:timer-links
```

For the complete release suite, including the gesture preview:

```sh
npm run test:release
```

The release suite builds the site, runs unit and browser checks, and writes a report under `docs/verification-<version>.json`. Screenshots and detailed measurements are written to the ignored `test-results/` directory. [QA.md](../QA.md) records tested behavior, performance measurements, and device coverage.

## Animation previews

These pages are development tools served from the local repository. They are excluded from the production build.

| Local path | Purpose |
| --- | --- |
| `/docs/mindfulness.html` | All 40 mindfulness activities, sunrise slider, fixed namaste closing, and accelerated countdown |
| `/docs/rig-proof/little-breaks.html` | All 24 cat diversions and the 59 → 0 scratch countdown |
| `/docs/rig-proof/motion.html` | Cat and fox motion, camera views, playback speed, and seeking |
| `/docs/rig-proof/friendly-review.html` | Historical side-by-side character appearance study |

The previews import the shipping character modules. See the [motion-study notes](rig-proof/README.md) for details.

## Source layout

| Location | Purpose |
| --- | --- |
| `src/clock.js` | Deadline, timer states, warning phases, and duration limits |
| `src/app.js` | Controls, settings, keyboard input, and rendering loop |
| `src/scenes.js`, `src/depth.js` | Analog glass, digital solids, visitors, debris, and endings |
| `src/paint.js` | Asset loading and shared offscreen character renderer |
| `src/characters/` | Geometry, skins, skeletal poses, materials, props, and bundled Three.js |
| `src/cat-actions.js`, `src/boredom.js` | Glass contact and quiet-minute gestures |
| `src/mindfulness.js`, `src/characters/mindfulness.js` | Silent activity scheduling, sunrise, breathing, yoga poses, and fixed closing |
| `src/audio.js` | Synthesized end sound, ticking, and ambient tones |
| `tests/` | Unit, browser, motion, and performance checks |
| `scripts/` | Build, geometry generation, release checks, and packaging |

The [architecture notes](ARCHITECTURE.md) describe timing and animation behavior. [ASSETS.md](../ASSETS.md) records artwork provenance and dependency licensing.

## Rebuilding character surfaces

Finished character assets are committed and do not need regeneration for normal development or hosting. After changing construction geometry, run `node scripts/extract-cast.mjs` with the local server available, then `node scripts/build-smooth-skins.mjs <species...>`. Check the resulting surfaces and motion before committing the generated assets.

## Shared timer links

`?mode=mindfulness&duration=60&start=1` selects mindfulness and automatically starts a one-minute countdown after all timer artwork is ready. Modes are `analog`, `digital`, and `mindfulness`; duration is an integer number of seconds within the normal timer limit. Omitting `start=1` fills the setup without starting. Incomplete or invalid presets leave the default setup unchanged.

`src/links.js` validates the URL. Loading a direct-start link does not unlock browser audio; sound still requires a user interaction. The one-minute mindfulness QR files are in `docs/qr/`. They contain the public timer URL directly, without a redirect or tracking service.

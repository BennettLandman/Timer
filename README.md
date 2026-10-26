# timer.

**Time to keep track of time.** A quiet JavaScript classroom timer with painted 3D characters. Version 2.0.1 integrates the approved cat/fox appearance, continuous joints, corrected elbows, and friendlier faces into the application.

- **The painter:** a cat works behind textured frosted glass. The cat paints the first minute hand immediately after Start, then erases and repaints at minute changes. Its quieter head and paw movements remain visible between strokes, and the setup preview demonstrates the painting. During the last minute, the claws remove each second’s perimeter mark and leave scratches. The final scratch leads into the glass break and artist reveal; a gentle alternative is available.
- **The builders:** solid segments enter recessed sockets from behind and fall forward into debris. Twenty-five animated animals visit occasionally to clear the floor. At zero, the red-capped cat peeks from behind the clock, whose housing stays fixed.

Characters are continuous 3D surfaces with skeletal motion and stable painted materials. Poses are evaluated from elapsed time; no image-frame sequences, crossfading, or image warping remain. One shared offscreen WebGL renderer supplies the characters to the clock scenes. The cast shares the approved material and facial style, with species-specific proportions, markings, ears, horns, wings, shells, and tails.

![Timer setup](docs/setup.png)

[See all 25 characters](docs/characters.png).

## Run locally

No package installation is required. Serve the repository with a static web server:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. JavaScript modules require a server rather than opening the HTML as a file. Use a browser with WebGL 2 enabled. The complete site is approximately 29 MB before transfer compression. Assets and shaders are prepared before Start becomes available.

## Private hosting

With Node.js 18 or newer:

```sh
npm run build
```

Upload the contents of `dist/` to your private static host, or extract `releases/Timer-private-hosting.zip`. See [HOSTING.md](HOSTING.md). Everything is local: no CDN, remote fonts, tracking, accounts, API keys, backend, or package installation. The Three.js runtime and its MIT license are bundled. Nothing has been publicly deployed.

## Use

Choose a scene, a preset (1, 5, 10, 15, or 30 minutes), or a custom duration. Controls offer pause/resume, restart, cancel, +3 minutes, +5 minutes, custom added time, and fullscreen. Space pauses/resumes when the page has focus; F toggles fullscreen. Buttons retain normal keyboard behavior. Dialogs support Escape.

Sound defaults to silent. End sound, ticking, and original ambient tones have independent switches, volume, and master mute. Settings remain in the current browser. Less motion and the operating system’s reduced-motion preference provide still characters and simple clock changes.

Red lasts `min(60, original duration / 6)` seconds, with yellow lasting twice as long immediately beforehand. A five-minute timer turns yellow at 2:30 and red at 0:50; a ten-minute timer turns yellow at 3:00 and red at 1:00. Added time preserves those thresholds. Restart restores the selected duration. Times are capped at 999:59.

The analog hands represent remaining minutes within the hour and hours. An exact readout below the dial clarifies every duration. The cat repaints the long hand at minute changes. Final-minute scratches reflect current remaining time, including after added time. Countdown accuracy is independent of rendering speed and reconciles with the deadline when a background tab returns.

## Checks and maintenance

```sh
npm test
npm run build
npm run test:browser
npm run test:rig
npm run test:performance
```

Browser checks require Playwright, Chrome, and the local server. Set `PLAYWRIGHT_PATH` to an installed Playwright package and optionally `CHROME_PATH` to the browser executable. `npm run test:gaits` checks the additional animals’ planted feet. Screenshots and measurements are saved under ignored `test-results/`. See [QA.md](QA.md) for evidence and device-testing limits.

The approved motion demonstration remains at `/docs/rig-proof/motion.html`; it imports the shipping rigs. To rebuild the additional continuous surfaces after changing construction geometry, run `node scripts/extract-cast.mjs` with the local server, followed by `node scripts/build-smooth-skins.mjs <species...>`. These are development steps; hosting needs only the finished static build.

## Source map

- `src/clock.js`: deadline timer, states, phase rules, and bounds.
- `src/characters/`: painted materials, anatomical rigs, continuous skins, bundled renderer, and cast.
- `src/paint.js`: asset preparation, shared 3D renderer, and glass contacts.
- `src/cat-actions.js`: second-by-second claw and brush choreography.
- `src/scenes.js` / `src/depth.js`: glass, painted marks, projected solids, debris, visits, and endings.
- `src/app.js` / `src/audio.js`: interface, settings, keyboard, render loop, and original synthesized audio.
- [PLAN.md](PLAN.md): final scope and confirmed decisions.
- [ASSETS.md](ASSETS.md): provenance and licenses.

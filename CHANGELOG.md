# Release notes

## 2.3.2 · October 27, 2026

- Add shareable timer links with mode, duration in seconds, and optional automatic start after artwork loading.
- Include a QR code that opens and starts a one-minute mindfulness timer directly.
- Validate link presets and preserve the normal setup for incomplete or invalid links.

## 2.3.1 · October 27, 2026

- Fix returning visitors seeing the digital clock in the homepage mindfulness preview when an older renderer remained cached.
- Publish all runtime files under a shared content-versioned directory so each page loads a matching renderer, controls, styles, and artwork.
- Add a browser regression for stale renderer URLs, all three homepage previews, mode switching, reload, reduced motion, and desktop/mobile layouts.
- Preserve source verification and checksum validation in downloadable site packaging.

## 2.3.0 · October 27, 2026

- Add **Mindfulness**, a third clock mode with the analog painter and a continuous starry-night-to-sunrise sky behind the glass.
- Add 40 silent, shuffled activities: four breathing patterns, twelve standing poses, ten seated poses, eight floor poses, and six training exercises inspired by *The Karate Kid* films.
- Express breathing with body and paw movement, with no readable activity prompts.
- Erase the last minute’s line and paint zero in the final six seconds, then settle into a fixed namaste closing, held after completion. Mindfulness always ends gently.
- Preserve the original analog and digital modes, saved settings, and countdown controls. Respect reduced motion; pause freezes the sky and character.
- Add a local activity gallery with seeking, a sunrise slider, and an accelerated countdown review. Add scheduling, pose, closing, and browser checks.

## 2.2.0 · October 26, 2026

First public release of Timer, available on [GitHub Pages](https://bennettlandman.github.io/Timer/) and as a downloadable static website.

- Two illustrated clocks: **The painter**, with a cat behind frosted glass, and **The builders**, with moving solid digits and visiting animals.
- Painted 3D characters, a 25-animal cast, and 24 occasional cat diversions.
- Counter-clockwise scratching through the final seconds, from 59 to 0, and a red-capped cat reveal at the end of the digital timer.
- Presets and custom durations, pause/resume, restart, cancellation, added time, and full screen.
- Green, yellow, and red warning phases, with red capped at one minute and yellow lasting twice as long.
- Optional end sound, ticking, and ambient tones; all sound starts off.
- A gentle analog ending, reduced-motion support, keyboard controls, and saved browser preferences.
- Static hosting with bundled runtime assets and no account or installation requirement for visitors.

Release checks cover the countdown, controls, animation contacts, all character models, mobile layout, and production hosting. See [QA.md](QA.md) for evidence and browser/device limitations.

Earlier versions were development milestones. Historical artwork and motion studies are retained in the source repository; the release uses continuous 3D animation.

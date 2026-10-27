# Testing and browser coverage · Timer 2.3.0

Release checks ran on October 27, 2026, with installed desktop Chrome, hardware-accelerated WebGL on an Apple M4 Pro, and Playwright. The complete [machine-readable report](docs/verification-2.3.0.json) records the results. See the [developer guide](docs/DEVELOPMENT.md) to repeat the suite with a local server and Playwright.

## 2.3.2 timer links and QR code

All 52 unit checks and the direct-link browser checks passed. The one-minute mindfulness link starts automatically after artwork loading, preserves a full minute, supports pause and restart, and reaches the namaste closing. A link without automatic start fills the setup; malformed presets leave its defaults unchanged. The 1128px QR PNG was decoded with the native macOS QR detector and matched the public link exactly. See the [2.3.2 verification record](docs/verification-2.3.2.json).

## 2.3.1 homepage preview correction

The stale-renderer regression reproduces a mindfulness preview falling back to the digital clock at the old unversioned renderer URL. The production build now places the full runtime in a shared content-versioned directory. Targeted browser checks cover all three previews, repeated mode switching, reload, reduced motion, and 1440px/390px layouts while the legacy renderer remains available at its original URL. Release ZIP validation checks both source fidelity and the rewritten entry paths.

All 49 unit checks, the targeted homepage and production browser checks, and release ZIP validation passed. The [2.3.1 verification record](docs/verification-2.3.1.json) records this scope. The full 2.3.0 animation verification remains linked above; this correction changes production asset addressing rather than the timer or character poses.

## Automated coverage

- **48 unit checks:** deadline accuracy after background gaps; pause/resume/add/restart; warning thresholds and caps; input/duration bounds; digital projection depth; all 25 closed, connected continuous character surfaces; normalized skin weights; cat waist isolation and gradual elbow influences; deterministic diversion timing; varied action order; skipping short intervals, the 40-activity mindfulness deck, breathing continuity, and continuous sunrise colors.
- **Controls and all species:** invalid input, start, the original analog and digital modes, pause, frozen countdown, add while paused, resume, restart, cancel, custom added time, completion, revival after completion, saved settings, and 25 visibly changing continuous 3D characters at small size. At least 16 sampled distinct poses per species.
- **Long sequences:** background reconciliation, minute painting, final-minute scratches, glass break/reveal, optional synthesized audio without runtime errors, mute, saved preferences, pixel-identical paused canvas, reduced motion, and a three-minute visitor/debris simulation. Debris is capped at 100; visits remain separated by more than 30 seconds.
- **Glass contact:** 180 scratch-contact samples cover all 60 second marks, with maximum projected error below 0.01 pixel. Brush reach is checked across the dial and the full painted stroke. Elbow motion remains within 10–145 degrees. This verifies geometric contact; appearance is also inspected in captured start/middle/end painting and four-quadrant scratching frames.
- **Analog visibility regression:** compare glass-interior pixels rather than changing readout text. Verify visible movement in the first seconds, between minute changes, and in the setup preview; a continuous preview loop; unchanged pixels for reduced motion and pause; and actual Start/Pause interface behavior.
- **Quiet diversions:** inspect all 24 gestures through the actual glass renderer. Sample the complete reach/return paths, supported and lifted feet, both hand targets, elbow limits, transition continuity, and deterministic seeking. Verify reduced motion and final-minute scratching suppress the diversions. The gesture preview page also passes all 24 selection controls, 24 distinct rendered poses, the 59 → 58 → … → 0 order, visible first-tick removal, preservation of the zero tick until the end, and a 390px overflow check. Measured hand-target error is below 0.005 world units and pose boundaries match ordinary idle within 0.000001.
- **Digital ending:** normal and 999:59 housing geometry stays fixed at completion; the cat visibly emerges from behind it. Sampled normal housing pixels are identical, with at most one channel value of antialiasing difference in the long-format check.
- **Walking anatomy:** all 22 additional walking species have reachable foot targets and planted stance; fish uses a fin/tail/flop action. The separate cat/fox regression checks foot planting, the single elbow, wrist bend, contact, loop closure, deterministic seeking, pause, and mobile layout.
- **Production package:** served from `/dist/` to verify subdirectory-relative resources, mobile layout, keyboard pause/resume, completion, and no external requests or page errors.

## Mindfulness coverage

All 40 silent activities and the fixed namaste closing are rendered through the shipping glass renderer. The catalogue covers four breathing patterns, twelve standing poses, ten seated poses, eight floor poses, and six training exercises. Checks verify distinct skeleton poses and rendered frames, constant limb lengths, bounded elbows, exact transitions back to idle, deterministic seeking, short-interval skips, night/twilight/dawn/sunrise samples, and a 390px layout.

The final sequence is checked explicitly: erase the last minute's line, paint zero, then enter namaste. Three random seeds produce the same held closing. Reduced motion suppresses random activities; repeated still rendering differs by less than 0.01 of a color-channel value on average at antialiased edges. The actual interface checks pixel-identical paused scenes, a frozen sky, added time while paused, restart, completion, and revival after completion. There are no activity prompts or spoken instructions.

## Local animation measurements

The original analog and digital scenes and the ukulele diversion are sampled for 120 frames at a 1440 × 1000 viewport. The analog test includes the active final-minute 3D cat and scratches; digital includes an animated visitor and 100 debris fragments. Median frame intervals are approximately 16.7 ms, with the 95th percentile approximately 16.8 ms on this machine, equivalent to its 60 Hz refresh. Exact values are recorded in the report. Frame pacing depends on the browser, display, and hardware.

The cat/fox motion regression retains an 8-degree wrist bend, one rigid upper-arm segment, elbow flexion approximately 31–120 degrees, planted cat ankles, and matching fox stance velocity. Production glass work uses the same solver with its own targets; its sampled elbow range is approximately 42–89 degrees.

## Visual and device scope

Captured and inspected setup, all three running scenes, painting, scratches, all species, the fixed-clock peek, all 40 mindfulness poses, sunrise stages, the namaste closing, and completion. Layout checks include a 390 × 844 mobile viewport and reduced-motion emulation. The cast and setup captures are retained under `docs/`; fuller evidence is generated under ignored `test-results/`.

Physical tablets, classroom projectors, low-powered classroom hardware, Safari, Firefox, and Edge have not been validated in this release run. Mobile viewport emulation does not test a physical touch device or another browser engine. Confirm loading, animation, full screen, and audio on the intended classroom device before use.

## Hosting handoff

The 2.2.0 public-release archive was compared byte-for-byte with its source and build, including per-file SHA-256 hashes and ZIP integrity checks. Live Chrome checks for that release passed for both original clock modes, pause/resume, completion, and a 390px mobile layout. All 25 models loaded; 74 observed responses matched the 2.2.0 build, with no request failures or JavaScript errors.

The 2.3.0 mindfulness preview was approved on October 27, 2026. The production build passed local subdirectory-hosting checks. The local verification report does not attest to a GitHub Pages deployment or a new downloadable release. See the [hosting guide](HOSTING.md) for publishing and archive validation.

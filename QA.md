# Testing and browser coverage · Timer 2.2.0

Release checks ran on October 26, 2026, with installed desktop Chrome, hardware-accelerated WebGL on an Apple M4 Pro, and Playwright. The complete [machine-readable report](docs/verification-2.2.0.json) records the results. See the [developer guide](docs/DEVELOPMENT.md) to repeat the suite with a local server and Playwright.

## Automated coverage

- **44 unit checks:** deadline accuracy after background gaps; pause/resume/add/restart; warning thresholds and caps; input/duration bounds; digital projection depth; all 25 closed, connected continuous character surfaces; normalized skin weights; cat waist isolation and gradual elbow influences; deterministic diversion timing; varied action order; and skipping short intervals.
- **Controls and all species:** invalid input, start, both modes, pause, frozen countdown, add while paused, resume, restart, cancel, custom added time, completion, revival after completion, saved settings, and 25 visibly changing continuous 3D characters at small size. At least 16 sampled distinct poses per species.
- **Long sequences:** background reconciliation, minute painting, final-minute scratches, glass break/reveal, optional synthesized audio without runtime errors, mute, saved preferences, pixel-identical paused canvas, reduced motion, and a three-minute visitor/debris simulation. Debris is capped at 100; visits remain separated by more than 30 seconds.
- **Glass contact:** 180 scratch-contact samples cover all 60 second marks, with maximum projected error below 0.01 pixel. Brush reach is checked across the dial and the full painted stroke. Elbow motion remains within 10–145 degrees. This verifies geometric contact; appearance is also inspected in captured start/middle/end painting and four-quadrant scratching frames.
- **Analog visibility regression:** compare glass-interior pixels rather than changing readout text. Verify visible movement in the first seconds, between minute changes, and in the setup preview; a continuous preview loop; unchanged pixels for reduced motion and pause; and actual Start/Pause interface behavior.
- **Quiet diversions:** inspect all 24 gestures through the actual glass renderer. Sample the complete reach/return paths, supported and lifted feet, both hand targets, elbow limits, transition continuity, and deterministic seeking. Verify reduced motion and final-minute scratching suppress the diversions. The gesture preview page also passes all 24 selection controls, 24 distinct rendered poses, the 59 → 58 → … → 0 order, visible first-tick removal, preservation of the zero tick until the end, and a 390px overflow check. Measured hand-target error is below 0.005 world units and pose boundaries match ordinary idle within 0.000001.
- **Digital ending:** normal and 999:59 housing geometry stays fixed at completion; the cat visibly emerges from behind it. Sampled normal housing pixels are identical, with at most one channel value of antialiasing difference in the long-format check.
- **Walking anatomy:** all 22 additional walking species have reachable foot targets and planted stance; fish uses a fin/tail/flop action. The separate cat/fox regression checks foot planting, the single elbow, wrist bend, contact, loop closure, deterministic seeking, pause, and mobile layout.
- **Production package:** served from `/dist/` to verify subdirectory-relative resources, mobile layout, keyboard pause/resume, completion, and no external requests or page errors.

## Local animation measurements

Both production scenes and the ukulele diversion are sampled for 120 frames at a 1440 × 1000 viewport. The analog test includes the active final-minute 3D cat and scratches; digital includes an animated visitor and 100 debris fragments. Median frame intervals are approximately 16.7 ms, with the 95th percentile approximately 16.8 ms on this machine, equivalent to its 60 Hz refresh. Exact values are recorded in the report. Frame pacing depends on the browser, display, and hardware.

The cat/fox motion regression retains an 8-degree wrist bend, one rigid upper-arm segment, elbow flexion approximately 31–120 degrees, planted cat ankles, and matching fox stance velocity. Production glass work uses the same solver with its own targets; its sampled elbow range is approximately 42–89 degrees.

## Visual and device scope

Captured and inspected setup, both running scenes, painting, scratches, all species, the fixed-clock peek, and completion. Layout checks include a 390 × 844 mobile viewport and reduced-motion emulation. The cast and setup captures are retained under `docs/`; fuller evidence is generated under ignored `test-results/`.

Physical tablets, classroom projectors, low-powered classroom hardware, Safari, Firefox, and Edge have not been validated in this release run. Mobile viewport emulation does not test a physical touch device or another browser engine. Confirm loading, animation, full screen, and audio on the intended classroom device before use.

## Hosting handoff

The archive is built from the production directory and compared byte-for-byte with the current source and build. Every site entry is checked against SHA-256 hashes after compression, and the ZIP integrity check must pass. It includes hosting instructions, the asset ledger, the source commit, a content manifest, and the bundled renderer’s MIT license. These release measurements preceded public hosting. The public site is now hosted on GitHub Pages. Live Chrome checks passed for both clock modes, pause/resume, completion, and a 390px mobile layout. All 25 model files loaded, all 74 observed responses matched the production build byte-for-byte, and no request failures or JavaScript errors were observed. See the [hosting guide](HOSTING.md) for the publishing workflow.

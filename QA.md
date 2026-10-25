# Verification record

Verified locally on October 25, 2026. The website has not been deployed.

## Automated checks completed

- Seven passing unit tests cover absolute-deadline accuracy after a long background interval; pause/add/resume/restart; warning boundaries for short and long durations; adding time across color phases; adding after completion and duration limits; input validation/formatting; and the 25-species cast.
- Chrome browser checks pass for both scenes, invalid input, start, pause, frozen paused readout, added time while paused, resume, restart, cancel, custom additions, completion, and adding time after completion. No JavaScript runtime errors were reported.
- Every one of the 25 species was rendered at 64 points across a full movement cycle. Each produced 33 distinct raster poses, exceeding the 16-frame requirement. Continuous interpolation renders additional in-between poses at the display's refresh rate; this is not a fixed sprite animation.
- At a 1440 × 1000 browser viewport, a 120-frame local headless Chrome sample during analog painting measured a median of 16.7 ms and a 95th percentile of 16.7 ms per frame (about 60 fps). Performance depends on the target device and browser.
- A simulated three-minute digital sequence verified multiple cleanup visitors, spacing above the required 30 seconds, at most seven simultaneously falling segments, and a debris cap of 100 fragments. Exact randomized visit times vary between runs.
- Extended browser sequences exercised minute painting, all final-minute scratch accumulation, glass break and cat reveal, saved settings, audio-control activation, master mute, and reduced motion. The paused canvas was compared byte-for-byte across time and remained identical.
- Desktop and 390 × 844 mobile layouts were visually inspected, including both clocks, completion, the character contact sheet, final scratches, and a cleanup visitor. The mobile document has no horizontal overflow. The mobile clock was enlarged after the first visual check.
- The production copy was checked under `/dist/` to verify subdirectory hosting, keyboard pause/resume, completion, no external resource requests, and no JavaScript runtime errors.

## Limits of verification

Tests ran in installed Google Chrome on this Mac. Safari, Firefox, Edge, physical tablets, a classroom projector, and low-powered classroom computers have not been tested here. Actual speaker volume and ambient/end-sound preferences should be checked on the classroom device. Private host access controls are the owner's hosting configuration and have not been exercised.

A suspended browser/device cannot guarantee on-time audio callbacks. Displayed time reconciles with the deadline when the page becomes active again. The application provides no service worker or background alarm service.

## Reproduce

See README.md for local serving and optional Playwright test instructions. `tests/browser.mjs`, `tests/sequences.mjs`, `tests/performance.mjs`, and `tests/production.mjs` write screenshots or results to `test-results/` (ignored by Git). Run `npm run build` before the production check. No browser automation package is shipped in the production build.

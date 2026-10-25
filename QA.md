# Verification record

Verified locally on October 25, 2026. The pose-based animation revision is ready for private hosting; no deployment was performed.

## Animation revision

All character mesh warping has been removed. The runtime uses 28 prepacked painted sequences with 24 poses each: 25 gaits plus dedicated cat painting, claw-scratching, and peeking actions. Frames are registered to a common scale and ground anchor before playback. Scratch clips play one 24-pose cycle per second; painting and peeking head-motion clips use 0.8-second pose cycles, with continuous scene positioning. The browser only selects and draws complete frames; it does not extract silhouettes, stretch limbs, or deform a texture mesh while the timer runs.

The cat visibly reaches, contacts the glass with its forepaw/claws, scratches downward, and retracts before shifting position. One contact interval adds a set of three scratches each second in the final minute. The last stroke remains in contact through the glass-break deadline. Earlier minute changes use the forepaw erasing poses followed by coordinated body/tail painting poses.

At digital completion the actual running housing geometry, width, location and socket layout are reused. The red-capped cat rises from behind the unchanged top edge and changes head pose. The panel occludes its lower body. The completion caption sits below the clock rather than displacing it.

## Automated checks

- Thirteen unit tests pass: timer deadlines, pause/add/resume/restart, warning boundaries, extension behavior, limits, input/formatting, cast membership, projected depth, per-second claw contact, short timers, bounded pose selection, final peek hold, and the last scratch reaching the break deadline.
- Browser controls pass for both scenes, invalid input, start, pause, frozen readout, added time while paused, restart, cancel, custom additions, completion, and adding time after completion. No JavaScript runtime errors were reported.
- Each of the 25 gait sequences was sampled at 64 points through its cycle. Each produced 24 distinct rendered poses, exceeding the 16-frame requirement. The manifest contains 24 registered complete poses for every action.
- A dedicated pixel comparison verifies unchanged housing-corner pixels and identical geometry through normal-duration completion. A long-duration layout also remains registered, with a maximum one-channel difference of 1 from raster antialias rounding. The cat's above-panel region changes as it peeks out.
- Final-minute contact/retract frames, accumulated claw scratches, painting, the complete cast, digital peeking, and desktop/mobile layouts were visually inspected. Generated fox/elephant atlases with touching figures were replaced; registered packing preserves complete limbs that cross nominal cell edges.
- A three-minute digital simulation verifies randomized visitors spaced over 30 seconds apart, a bounded pile of 100 fragments, and at most seven simultaneously falling segments in that run. Values can vary with random choices. The paused canvas remains byte-for-byte identical across time.
- At 1440 × 1000, local Chrome 120-frame samples measured median render intervals of 16.7 ms in both modes, with 95th percentiles of 16.7 ms for active final-minute scratching and 16.8 ms for a digital visitor with 100 fragments. This is approximately 60 screen renders per second on the test machine; character playback uses the 24-pose cycles.
- The production copy under `/dist/` passes subdirectory hosting, keyboard pause/resume, completion, no external requests, and no runtime-error checks.
- Packed PNG intermediates and the lossless WebP delivery images were decoded and compared. All 28 RGBA buffers match exactly. Frame registration is delivered in the manifest, avoiding runtime extraction work.

## Scope

Tests ran in installed Google Chrome on this Mac. Safari, Firefox, Edge, physical tablets, projectors, and low-powered classroom computers have not been tested here. Frame pacing depends on hardware and browser. Actual speaker volume and private-host access controls require checks on the owner's hosting/classroom setup.

The characters are painted pose animations rather than motion capture or a physically simulated skeleton. Their anatomy and action transitions were visually reviewed; artistic motion quality remains something to judge in the local preview.

A suspended browser/device can delay audio callbacks. The displayed time reconciles with its deadline when the tab becomes active. No service worker or background alarm service is installed.

## Reproduce

See README.md for local serving and optional Playwright instructions. `tests/anatomy.mjs` covers claw scenes and the stationary-housing peek regression. Browser scripts write evidence to `test-results/` (ignored by Git). Build before running `tests/production.mjs`. No browser automation package ships in the website.

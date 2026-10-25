# Verification record

Verified locally on October 25, 2026. The painted application is ready for private hosting; no deployment has been performed.

## Automated checks completed

- Nine passing unit tests cover deadline accuracy after a long background interval; pause/add/resume/restart; warning boundaries for short and long durations; adding time across phases; adding after completion and duration limits; input validation/formatting; the 25-species registry; and physical depth projection, including segments enlarging as they emerge toward the viewer.
- Chrome browser checks pass for both scenes, invalid input, start, pause, frozen paused readout, added time while paused, resume, restart, cancel, custom additions, completion, and adding time after completion. No JavaScript runtime errors were reported.
- Every one of the 25 painted species was rendered at 64 points across a full movement cycle. Each produced 64 distinct raster poses, exceeding the 16-frame requirement. Continuous raster-mesh interpolation renders poses at the display refresh rate while preserving the approved brushwork and identity.
- At a 1440 × 1000 viewport, 120-frame local headless Chrome samples measured a median of 16.7 ms per frame in both modes. The analog test, with active final-minute cat/tail motion and scratches, had a 95th percentile of 16.8 ms. A digital scene with a painted visitor and 100 debris fragments had a 95th percentile of 16.7 ms. These are about 60 fps on the test machine; performance depends on device and browser.
- A simulated three-minute digital sequence verified multiple randomized cleanup visitors, spacing above the required 30 seconds, a maximum of seven simultaneously falling segments in that run, and the debris cap of 100 fragments. Visit times and measured particle maxima can vary between randomized runs.
- Extended browser sequences exercised minute-hand erasing/repainting, final-minute scratch accumulation, glass break and painted-cat reveal, saved settings, audio-control activation, master mute, and reduced motion. The paused canvas remained byte-for-byte identical across time.
- The production copy was checked under `/dist/` for subdirectory hosting, keyboard pause/resume, completion, no external resource requests, and no JavaScript runtime errors.

## Visual review and fixes

Desktop and 390 × 844 mobile layouts were inspected, including both clocks, completion, the complete painted cast, final scratches, and a cleanup visitor. There is no horizontal document overflow on mobile.

The visual review found and corrected three issues beyond the control tests: inactive sockets were too dark for clear digits; nominal atlas cell boundaries could clip a face or include neighboring fur; and some debris landed above the floor. The renderer now distinguishes the recess material, decodes connected alpha silhouettes, normalizes each animal, constrains visitor height below the digits, and lands fragments at the floor. Paint assets are decoded before starting the timer to avoid a first-visitor extraction stall.

## Limits of verification

Tests ran in installed Google Chrome on this Mac. Safari, Firefox, Edge, physical tablets, classroom projectors, and low-powered classroom computers have not been tested here. Actual speaker volume and sound preferences should be checked on the classroom device. The owner's private host access controls have not been exercised.

The character animation is an articulated raster-mesh interpretation of approved paintings, rather than independently hand-painted frames for every step. It supplies continuous body/limb/tail deformation and distinct bird/fish motion while retaining the same pigment and identity. Physical locomotion and classroom distraction level remain subjective qualities to assess in the local preview.

A suspended browser/device cannot guarantee on-time audio callbacks. Displayed time reconciles with the deadline when the page becomes active again. No service worker or background alarm service is installed.

## Reproduce

See README.md for local serving and optional Playwright instructions. Browser scripts write screenshots and results to `test-results/` (ignored by Git). Run `npm run build` before `tests/production.mjs`. No browser automation package ships in the production build.

# Timer architecture

Timer combines a deadline-based countdown with animated Canvas 2D scenes. Painted 3D characters are rendered through one shared transparent WebGL surface and composited into the clocks. The application runs entirely in the browser.

## Timing and controls

`src/clock.js` owns the timer state and absolute deadline. Countdown accuracy does not depend on animation frame rate. Pause, resume, added time, and restart update this state; returning from a background tab reconciles the display with the deadline.

For an original duration `D` in seconds, the red interval is `R = min(60, D / 6)`. Yellow begins with `3R` remaining and lasts `2R`; red begins at `R`. Added time preserves these thresholds. Durations range from 1 second to 999 minutes, 59 seconds.

`src/app.js` connects the controls, settings, keyboard input, screen-reader announcements, and rendering loop. Settings are stored in browser local storage when available. Sound is synthesized with Web Audio and starts disabled.

## Character rendering

The 25 characters use continuous skinned surfaces, fixed-length limb constraints, and time-based poses. Geometry and normalized skin weights are generated offline and committed as local assets. Runtime movement uses skeletal deformation rather than playback of painted image frames.

`src/paint.js` prepares the models and shaders, then renders characters through a shared offscreen WebGL renderer. Painted materials combine stable pigment, markings, and surface texture. The cat includes an image-generated tabby material; other species use procedural markings and materials. See [asset credits](../ASSETS.md).

## Analog scene

The frosted-glass appearance combines texture, blur, and compositing. Brush and claw targets drive both the cat’s paw position and the marks on the glass. The cat paints at the start and at minute changes, lowering its body to reach lower marks while keeping its supported feet planted.

In a quiet full minute, a shuffled deck can select one of 24 brief diversions. Each eases into and out of ordinary idle movement and finishes before the next painting stroke. Short intervals skip a diversion that cannot finish in time. Diversions are silent and disabled during the final minute and reduced motion.

During the last minute, the cat removes one second mark at a time counter-clockwise, from 59 through 0. Short timers use only the available marks. The final stroke leads into the glass-break ending or the optional gentle reveal.

## Mindfulness scene

Mindfulness reuses the analog glass, minute painting, and fixed-length character solvers. `src/mindfulness.js` owns a 40-activity catalogue, a seeded shuffled deck, smooth breathing cycles, and a continuous sunrise palette. `src/characters/mindfulness.js` poses the skeleton, including seated and reclining positions. It does not play raster animation frames or display activity instructions.

The sky is derived from remaining time divided by the original duration: stars fade, the sun rises from behind the distant hills, and indigo changes through lavender and rose into a pale golden morning. Hill colors are blended into opaque fills so the land hides both the solar disc and its halo. Added time can return the sky to an earlier point; restart begins at night. Pause freezes the sky and poses. Reduced motion retains the gradual countdown palette with a still cat, followed by the fixed closing illustration.

Each minute offers two twenty-second windows, beginning at seconds 8 and 33 after the painting boundary. A seeded deck draws every activity once before repeating. Intervals too short to finish a complete activity skip it. The final minute keeps the same calm behavior until its last six seconds, when the cat erases the last minute’s line and paints the hand at zero. At the deadline it eases into namaste, with joined upright paws at the chest. This closing is excluded from the random deck and stays visible after completion. Mindfulness does not use claw scratches or the glass-break ending.

The four breathing patterns have a three- or four-second inhalation and a four- or six-second exhalation, without holds. The cat's body and paws provide the breathing motion during quiet activities. Labels appear only in the development gallery.

## Digital scene

Clock segments move through recessed sockets with perspective and depth. Ejected segments become bounded debris. Animals occasionally cross the floor to clear it; visits are spaced to avoid overlapping cleaners. Walking poses follow distance traveled.

At completion, the clock housing keeps its position and dimensions while the red-capped cat rises behind it. The housing provides the occlusion for the peek.

## Distribution

The production build contains `index.html` and a content-versioned copy of `src/`, including the local Three.js runtime and its license. The entry stylesheet, entry module, relative module imports, and artwork all resolve inside the same `src/<content-hash>/` directory. New deployments therefore cannot load a renderer cached at the previous release’s URL. GitHub Pages publishes this build after unit checks pass. Development previews and historical references remain outside the website build.

See the [developer guide](DEVELOPMENT.md), [hosting guide](../HOSTING.md), and [verification record](../QA.md) for commands and testing scope.

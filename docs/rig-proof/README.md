# Approved painted 3D motion study

The owner approved the cat/fox appearance, continuous joints, anatomical movement, corrected elbow, and friendlier faces, then authorized completion of the application. This study is now a reference for the shipping implementation in `src/characters/`; its model, material, and rig modules re-export that code.

Open `/docs/rig-proof/motion.html` for the six-second cat acting sequence, the fox walk, pause/speed/seek controls, small-size view, and front/quarter/elbow cameras. `friendly-review.html` retains the matched facial appearance review. `approval-still.png` and review captures show actual rendered geometry.

The main timer now uses those continuous 3D characters, glass-contact choreography, digital peeking, and the complete 25-species cast. The old raster sequences no longer ship. The glass is a texture-and-blur compositor treatment; the characters and joints are actual 3D geometry.

Run `npm run test:rig` for the approved motion regression. It checks the single elbow, wrist limits, planted cat ankles, fox stance, claw contact, loop closure, deterministic seeking, pause, and mobile layout. Production-specific motion checks and the other animals’ gait checks are separate scripts; see the main README and QA.md.

Three.js 0.180.0 and its complete MIT license are bundled under `src/characters/vendor/`. One approved image-generated tabby pigment swatch is mapped to the original cat surface. Other shapes, materials, markings, and motion are authored in code. See ASSETS.md for the material prompt and provenance. No further generated pose frames were used.

# Painted 3D character proof — motion review

The owner approved the first appearance still. Stage 2 is now available at `motion.html`: a six-second cat reach/contact/scratch/retract/weight-shift and a continuous fox walk, including a small-size view. It is one static pose rendered from actual Three.js geometry, with skinned tubular limb/tail meshes and named joint controls. The main timer still uses its existing renderer. Continuous joint animation is implemented in the demonstration. Production timer integration and expansion of the cast await motion review.

Serve the repository, then open `/docs/rig-proof/`. `approval-still.png` is a browser capture of the same local proof, not an image-generated promise of a future model. The right-hand panel composites the actual model render with a fixed blur and the existing granular glass asset; it is a glass appearance study, not physical glass transmission. Clock hands and contact choreography are deferred to the motion demonstration.

The motion study uses fixed-length limb constraints, an independently jointed wrist/claw contact, planted cat ankles, four phased fox legs, and matched foot velocity at lift-off/landing. The scratching removes one demonstration tick and leaves three lines at the claw path. This is one action example, not the complete final-minute clock choreography. The frosted layer in the motion study is a lightweight transparent texture overlay; production depth-dependent glass blur remains to be integrated. Tail painting and digital peeking remain subsequent actions. Artistic motion quality and target-device behavior require review.

## Files

- `cat.js`: mesh construction, bind-pose skeletons, and painted materials.
- `proof.js`: still rendering, light, camera, and glass composition.
- `assets/tabby-paint.png`: one generated pigment texture based on the approved cat reference. Used as a mapped surface, never as character pose frames.
- `vendor/`: Three.js 0.180.0, MIT licensed; the complete upstream license is included.
- `approval-still.png`: the single pose for appearance approval.

The still was rendered in installed Chrome with no page errors. Both panels fit a 390px mobile viewport. Rendering uses a single frame and no animation loop. The development capture's software WebGL setting is not a production performance benchmark.

## Texture generation

Built-in image-generation tool, 2026-10-25. Reference: `../art-review-v2/cat-cutout-reference.png`. Request: one seamless flat albedo material swatch matching the approved oil-painted ochre/gold/cream and charcoal tabby pigment, tactile small directional strokes, warm honey ochre base with jagged charcoal bands and cream flecks, matte impasto, even illumination, no cat/body/scene/text/shadows/vignette. No pose-sheet generation.

## Next approval gates

1. Appearance approved.
2. Motion demonstration implemented; owner review pending before production integration and cast expansion.
3. Integrate contact-driven clock marks and timeline-responsive controls. Verify frame pacing, input response, loop continuity and visible contact on intended devices.
4. Expand through suitable reusable body types once the first motions pass review.

## Motion checks

Run `npm run test:rig` with Playwright and installed Chrome. Evidence is recorded in `motion-checks.json`. The browser checks claw contact over the scratch, fixed cat ankle locations through body sway, fox stance foot placement, loop closure, order-independent seeking, pause freezing time, and mobile overflow. All pass. Local hardware-accelerated Chrome (Apple M4 Pro, ANGLE Metal) sampled approximately 60 renders per second. This is a local two-character demonstration measurement, not a guarantee for tablets or the full timer. No JavaScript errors were reported.

`rig.js` evaluates a pose from absolute time, avoiding accumulated frame-step errors. `fox.js` builds the procedural fox and computes its gait. `materials.js` shares the approved cat's paint treatment with the fox. `motion.js` handles the glass demonstration and controls. The small fox is copied from the same rendered pose, without a second model or WebGL renderer. No new AI pose sheets were generated.

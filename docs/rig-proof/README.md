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

## Continuous shoulders and hips — October 26, 2026

The original overlapping torso/limb pieces have been replaced in the preview with one closed, connected skinned surface per animal. The existing anatomical forms are fused offline as a smooth implicit surface; indexed vertices and normals are shared across shoulders, hips, neck, and limb transitions. Up to four normalized joint influences blend movement across each transition. The eyes, ears, beret, whiskers, and fine facial details remain separate features.

`skin-spec.js` extracts the original bind-pose forms and bone names; the saved specifications are `assets/*-skin.spec.json`. Run `node scripts/build-smooth-skins.mjs` to rebuild the delivery meshes (`assets/*-smooth.skin`). This geometry construction happens before delivery, not during animation. `smooth-skin.js` loads the packed surfaces, binds the existing joints, and applies continuous coat coloration. Original construction forms remain on a hidden rendering layer to retain the rig hierarchy.

`tests/smooth-skins.test.js` verifies that each body is exactly one connected component, every edge has two adjacent faces, and skin weights sum to one. The existing browser motion checks still pass. Both front and three-quarter viewing angles are available; the latter is the initial motion-preview view. The review capture shows all six action phases with the new surfaces.

The production timer still awaits motion approval and integration. Mesh connectivity prevents separation at joints; further artistic refinement of muscle deformation remains possible after review.

Joint transforms use dual-quaternion blending (`skin-deformation.js`) to preserve volume during large bends instead of flattening a joint through weighted matrices. The graphics check captures shader compilation failures as well as page errors. Fifteen source/unit checks and the dedicated motion/browser checks pass.

## Acting and anatomy revision — October 26, 2026

The earlier free-chain arm solve met contact targets but allowed several sections of the arm to bend independently. The original folded bind pose also merged moving forearms with the torso, and proximity-only weights allowed a resting hand to influence the hip. These defects made the movement implausible despite its smooth frame pacing.

The cat now has a neutral arm-clear bind pose, one elbow per arm, rigid intermediate upper-arm/forearm controls, pole-guided elbow placement, and bounded flexion. A closed-form solve places the wrist and palm together, retaining a small 8-degree wrist bend without iterative orientation flipping. The head leads the action. Staging is look/prepare, curved reach, contact, deliberate scratch, lift away, lower the hand, and return to balance. The free hand rests near the hip. The tail responds slightly to the weight shift rather than waving each segment independently.

Skin influence is now limited to anatomically adjacent groups and joint attachment regions. Hands do not influence waist/hip vertices merely because they rest nearby. `tests/smooth-skins.test.js` checks that regression. Surface connectivity and volume-preserving blending are retained.

The fox retains a quadrupedal walk. It now has separate rear stifle and hock controls, distinct front/rear bend directions, a slower four-beat cycle, lower foot clearance, reduced body/head oscillation, and contact shadows. It does not reuse the same two-link bend for all four legs.

The browser test measures the driven world-space elbow and wrist angles, verifies that the upper arm cannot develop a second bend, and checks claw contact, fixed cat ankles, fox support-foot placement, seeking, pause, graphics errors, and mobile fit. Sixteen unit/source checks pass. Local frame pacing remains approximately 60 fps. These are mechanical checks, not a certification of anatomical realism or artistic appeal; the owner must judge the normal-speed performance in the preview before integration.

Rigging reference: [Blender's IK constraint documentation](https://docs.blender.org/manual/en/latest/animation/constraints/tracking/ik_solver.html), specifically the elbow/pole-target relationship. The preview uses its own analytic solver rather than a Blender runtime.

## Elbow correction — October 26, 2026

Close-up review exposed a pointed web at the inside of the elbow/armpit and unwanted forearm roll. The upper arm and forearm now share a consistent bend-plane frame rather than independently taking shortest-arc rotations. The reach uses a lower/rearward elbow pole so the elbow stays lower during the early lift.

Arm weights now treat the upper arm and forearm as rigid sections, with narrower elbow and wrist transition bands. A build-time, surface-neighbor smoothing pass removes abrupt influence boundaries without transferring weights through spatially nearby parts. Waist/hip isolation is retained. A new regression limits influence jumps between adjacent elbow vertices. Seventeen unit/source checks and the motion browser checks pass, including front, three-quarter, and elbow-close-up view controls.

Choose **View → Elbow close-up** to examine the full action. `elbow-review.png` and `elbow-review-front.png` contain annotated joint close-ups at eight moments, inspected alongside the complete movement. These are engineering review captures, not final artwork. The skin fold is reduced and the bend plane is stable; artistic acceptance remains pending owner review.

## Friendlier faces — October 26, 2026

The owner accepted the motion and requested a cuter, more approachable appearance. The cat now has a slightly rounder head and cheeks, more open level eyes, softer round/oval pupils, larger catchlights, lighter relaxed brows, a warmer nose/beret, rounded ear tips, and upturned mouth corners. The fox has a softer head/muzzle, rounder brighter eyes with catchlights, a small smile, and rounded ear tips/warmer inner ears.

The same painted material treatment is retained. Head/face geometry and materials were changed directly in the native 3D models; no new generated images or pose sheets were needed. The skeleton positions, animation curves, elbow constraints, footfalls, and timing are unchanged. The fused skin surfaces were rebuilt for the small head changes. All 17 unit checks and the dedicated motion/browser checks pass, with the same measured joint/contact results as the accepted motion.

`friendly-review.html` compares one matched pose for each animal before and after the changes. `friendly-before.png` and `friendly-after.png` are actual browser-rendered model captures with matching camera, lighting, and pose. The motion page also uses the new faces. Friendlier appearance review is pending before expanding the cast.

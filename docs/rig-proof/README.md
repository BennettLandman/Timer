# Painted 3D character proof — awaiting approval

This is stage 1 of the agreed replacement animation strategy. It is one static pose rendered from actual Three.js geometry, with skinned tubular limb/tail meshes and named joint controls. The main timer still uses its existing renderer. No replacement animation clips have been created or integrated.

Serve the repository, then open `/docs/rig-proof/`. `approval-still.png` is a browser capture of the same local proof, not an image-generated promise of a future model. The right-hand panel composites the actual model render with a fixed blur and the existing granular glass asset; it is a glass appearance study, not physical glass transmission. Clock hands and contact choreography are deferred to the motion demonstration.

The model is a first procedural sculpture. The face, proportions, painted finish, and glass strength need owner approval before animation work. Bone controls are present; limb deformation, inverse kinematics, planted-foot behavior, natural gait, pause responsiveness, animation performance, and target-device behavior have not yet been validated. A successful still render is not evidence of smooth animation.

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

1. Approve or revise this still's character and material treatment.
2. Demonstrate a cat reach/contact/scratch/retract/weight-shift and a fox walk at the actual small display size. Approve motion before expanding the cast.
3. Integrate contact-driven clock marks and timeline-responsive controls. Verify frame pacing, input response, loop continuity and visible contact on intended devices.
4. Expand through suitable reusable body types once the first motions pass review.

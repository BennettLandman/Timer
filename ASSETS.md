# Asset provenance

Character poses were generated for this project with the built-in image_gen tool from the owner's approved paintings. No third-party sprite packs, existing paintings, recordings, or font files ship with the website. This is a private project; this ledger grants no public reuse license.

## Runtime artwork

| Asset | File | Treatment |
| --- | --- | --- |
| Cat walking | `src/assets/animation/cat-walk.webp` | 24 painted full-body gait poses. |
| Cat scratching | `src/assets/animation/cat-scratch.webp` | 24 upright reaching, claw-contact, downstroke, and retracting poses. |
| Cat painting | `src/assets/animation/cat-paint.webp` | 24 coordinated torso/head/tail painting poses. |
| Cat peeking | `src/assets/animation/cat-peek.webp` | 24 complete head/beret/shoulder/paw poses, occluded behind the clock in software. |
| Other 24 animals | `src/assets/animation/<species>-walk.webp` | One 24-pose gait sequence per approved species; bird, fish and frog actions follow their anatomy. |
| Frame registration | `src/assets/animation/manifest.json` | Pose bounds/ground anchors; additional fox/turkey body registration and closed playback order. |
| Frosted glass | `src/assets/glass.png` | Generated granular glass texture with phase tinting and depth-dependent blur. |
| Paint material | `src/assets/paint.png` | A blank textured region of the approved digital clock proof supplies surface pigment on projected geometry. |
| Clock hands, scratches and solid geometry | `src/scenes.js`, `src/depth.js`, `src/cat-actions.js` | Original procedural marks and geometry; claw marks follow the contact interval. |
| Ticking, end shimmer and ambient chords | `src/audio.js` | Original Web Audio oscillator synthesis. |
| Typography | CSS system font stacks | Installed fonts, with no distributed font files. |

There are 28 animation sequences and 672 pose cells in total. The runtime selects complete painted frames, blends adjacent poses, applies uniform scaling or horizontal reflection, and positions the character. It does not stretch individual limbs, warp an image mesh, or synthesize poses from a single painting.

Transparent silhouette extraction and ground registration were performed before packaging to retain complete limbs even when generated atlas figures slightly crossed nominal cell edges. Each packed PNG was encoded as lossless WebP and its decoded RGBA buffer was checked pixel-for-pixel against the packed PNG. This changed encoding, not the painting content.

[Exact animation prompts](docs/ANIMATION_PROMPTS.md) document built-in generation. The approved master cat reference is [the cutout](docs/art-review-v2/cat-cutout-reference.png); other approved stills remain under `docs/painted-cast/`. Prior single-pose runtime atlases are superseded and remain recoverable in Git history.

The owner supplied an Amsterdam clock screenshot as a conceptual reference. That screenshot and its captions are not runtime assets. No existing Matisse painting is reproduced.

## Experimental 3D proof (outside the production build)

`docs/rig-proof/` contains an original procedural cat model and one generated pigment texture derived from the approved cat reference. It uses locally vendored Three.js 0.180.0 under the included MIT license. See its README for provenance, rendering method, and outstanding approval/animation work. Its still depicts actual rendered geometry; the frosted panel is a compositor study. No new pose sequence is included.

The approved 3D study now also contains an original procedural fox (`fox.js`) and continuous joint motion (`rig.js`), sharing the same painted material code. No further generated character frames or third-party model assets were added.

The experimental cat/fox bodies were fused into original continuous skinned meshes on October 26, using the existing procedural bind-pose forms and paint texture. The meshes and their build specifications are under `docs/rig-proof/assets/`. No external model assets or new generated paintings were added for this revision.

The acting revision rebinds the existing painted cat in a neutral arm-clear pose and adds original fox hock controls. Skin weights are rebuilt from anatomical attachment regions. No new external artwork or model assets were added.

The friendliness revision changes native cat/fox face meshes and materials; before/after stills are captured from those actual models. No new generated bitmap artwork or third-party assets were added.

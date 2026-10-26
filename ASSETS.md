# Asset provenance — Timer 2.0.0

All character geometry, rigs, clock geometry, and sound synthesis are original project work. No third-party character models, sprite packs, recordings, paintings, or font files ship with the website. This private-project ledger grants no public reuse license for original artwork.

| Asset | Shipping location | Source and treatment |
| --- | --- | --- |
| Painted cat | `src/characters/cat.js`, `assets/cat-smooth.skin` | Original sculpted forms and skeleton; continuous surface with volume-preserving skinning and the approved corrected elbow. |
| Painted fox | `src/characters/fox.js`, `assets/fox-smooth.skin` | Original continuous quadruped with stifle/hock anatomy and planted stance. |
| Other 23 species | `src/characters/cast.js`, `assets/<species>-smooth.skin` | Original procedural forms, fused offline; species-specific anatomy, features, coat patterns, and gaits. |
| Surface construction | `src/characters/assets/*-skin.spec.json`, `scripts/build-smooth-skins.mjs` | Original bind-pose specifications, surface fusion, closed indexed meshes, and normalized skin weights. |
| Tabby pigment | `src/characters/assets/tabby-paint.png` | One generated material swatch based on the approved cat painting; mapped to geometry rather than used as pose frames. |
| Shared paint treatment | `src/characters/materials.js` | Original stable surface pigment shader and seeded micro-bump texture. No per-frame texture regeneration. |
| Frosted glass | `src/assets/glass.png` | Existing approved image-generation texture, phase-tinted with composited blur. This is an artistic frosted-glass treatment rather than a physical transmission simulation. |
| Clock pigment | `src/assets/paint.png` | Blank textured region of the approved digital-clock proof. |
| Clock marks and solids | `src/scenes.js`, `src/depth.js`, `src/cat-actions.js` | Original procedural geometry and strokes synchronized with the character’s glass target. |
| End shimmer, ticking, ambient tones | `src/audio.js` | Original Web Audio oscillator synthesis; no audio files. |
| Typography | CSS system stacks | Installed system fonts; no distributed font files. |
| Three.js 0.180.0 | `src/characters/vendor/` | Bundled upstream runtime under the included complete MIT license. No runtime CDN requests. |

## Approved references and material generation

The master cat reference is `docs/art-review-v2/cat-cutout-reference.png`; approved species stills remain in `docs/painted-cast/`. The user approved the continuous 3D cat/fox motion, elbow correction, and friendlier faces before authorizing full integration and cast completion. See `docs/rig-proof/friendly-review.html` for the matched appearance review.

The tabby material was generated with the built-in image-generation tool on October 25, 2026, using that approved cat reference. The prompt requested one seamless flat albedo swatch of oil-painted ochre/gold/cream and charcoal tabby pigment: small directional strokes, honey ochre, jagged charcoal bands, cream flecks, matte impasto, even illumination, and no cat, body, scene, text, shadows, or vignette. Other materials, markings, geometry, and motion are implemented directly in code. No further AI pose sheets were generated for version 2.0.0.

The user supplied the Amsterdam clock screenshot as a conceptual reference; neither the screenshot nor its captions ship with the website. No existing Matisse painting is reproduced.

## Superseded artwork

The old 24-pose raster sequences have been removed from the runtime and build. Their prompts and still approvals remain in the documentation; the old assets are recoverable from Git history. They are historical development evidence, not the animation method used by this release.

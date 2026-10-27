# Artwork and dependency credits

Timer’s character geometry, rigs, clock geometry, and sound synthesis were created for this project. The application includes a locally bundled Three.js runtime and a small number of image-generated material textures.

## What ships with the timer

Paths in this table are relative to the repository root and the release website directory.

| Asset | Location | Origin and use |
| --- | --- | --- |
| Cat and fox | `src/characters/cat.js`, `src/characters/fox.js` | Original character construction and anatomical rigs, rendered as continuous skinned surfaces. |
| Other 23 species | `src/characters/cast.js` | Original procedural character forms, species-specific proportions, markings, and gaits. |
| Character surfaces | `src/characters/assets/*-smooth.skin`, `*-skin.spec.json` | Generated from the project’s geometry specifications; closed indexed meshes with normalized joint weights. |
| Mindfulness sky and activities | `src/mindfulness.js`, `src/characters/mindfulness.js` | Original procedural sunrise, stars, 40 silent time-based activities, and a fixed namaste closing. Training gestures evoke exercises from *The Karate Kid* films; no film footage, characters, logos, dialogue, or audio is included. |
| Cat gestures and props | `src/boredom.js`, `src/characters/rig.js`, `src/characters/props.js` | 24 time-based routines and original 3D props, including a watch, biscuit, magnifier, book, teacup, and ukulele. |
| Tabby pigment | `src/characters/assets/tabby-paint.png` | An image-generated paint swatch mapped onto the cat’s 3D surface. |
| Shared painted materials | `src/characters/materials.js` | Procedural pigment, markings, and surface texture. |
| Frosted glass | `src/assets/glass.png` | An image-generated material texture, combined with phase tinting and blur. |
| Clock pigment | `src/assets/paint.png` | A blank textured region extracted from the project’s image-generated digital-clock study. |
| Clock marks and solids | `src/scenes.js`, `src/depth.js`, `src/cat-actions.js` | Procedural geometry and strokes synchronized with the countdown and character contact. |
| Sounds | `src/audio.js` | Original Web Audio synthesis for the end shimmer, ticking, and ambient tones. No recordings are distributed. |
| Typography | System font stacks | Fonts installed on the visitor’s device; no font files are distributed. |
| Three.js 0.180.0 | `src/characters/vendor/` | Third-party runtime distributed under its included MIT license. |

## Image-generated materials and references

The tabby swatch was generated on October 25, 2026, using the project’s painted cat reference. Its prompt requested a seamless matte oil-painted texture with ochre, cream, and charcoal tabby pigment, visible brushwork, and even illumination, without a character, scene, text, or lighting effects. It is a surface material, not an animation frame.

The frosted-glass texture and digital-clock pigment came from earlier image-generated material studies. Character shapes, skeletal movement, props, and the other species’ markings are implemented in code. The release does not use generated pose-frame sequences.

[Artwork notes](https://github.com/BennettLandman/Timer/blob/main/docs/ARTWORK.md) link the original character sheets and material studies retained in the source repository. The historical prompts document their creation. The Amsterdam clock screenshot supplied during development was a conceptual reference and is not distributed with the website. No existing Matisse painting is reproduced.

## Licensing

Three.js retains the copyright notice and MIT license in [`src/characters/vendor/LICENSE`](src/characters/vendor/LICENSE). A second copy accompanies the historical motion-study runtime in the source repository.

No additional reuse license for the project’s original artwork is granted by this document. Public source availability and hosting do not change the existing licensing terms.

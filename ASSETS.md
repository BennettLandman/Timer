# Asset provenance

All shipped character art and material images were generated for this project using the built-in image_gen tool, following the owner's approved painted style. No third-party sprite packs, stock recordings, font files, or existing paintings are shipped. No public reuse license is granted by this ledger; this is a private project.

| Asset | Runtime file | Provenance and treatment |
| --- | --- | --- |
| Beret cat | `src/assets/cat.png` | Transparent raster adaptation of the approved cat painting. Alpha preserved; articulated by a raster mesh. |
| Dog, panda, turtle, pig, bear, cow | `src/assets/cast-1.png` | Six approved painted single-pose characters, extracted to a transparent 3 × 2 atlas. |
| Fish, eagle, turkey, raven, rabbit, fox | `src/assets/cast-2.png` | Six approved painted single-pose characters, extracted to a transparent 3 × 2 atlas. |
| Deer, horse, sheep, goat, elephant, giraffe | `src/assets/cast-3.png` | Six approved painted single-pose characters, extracted to a transparent 3 × 2 atlas. |
| Zebra, lion, penguin, owl, frog, hedgehog | `src/assets/cast-4.png` | Six approved painted single-pose characters, extracted to a transparent 3 × 2 atlas. |
| Frosted glass | `src/assets/glass.png` | Generated physical glass texture; composited with tint, blur and painted marks. |
| Painted surface material | `src/assets/paint.png` | Approved digital clock proof; its blank impasto background region supplies surface texture on projected geometry. No characters from this image are used as moving rectangular cards. |
| Clock geometry, hands, scratches, fragments | `src/scenes.js`, `src/depth.js` | Original runtime geometry, perspective projection, and procedural motion. |
| Ticking, end shimmer, ambient chords | `src/audio.js` | Original oscillator synthesis using Web Audio. No recordings. |
| Typography | CSS system font stacks | Installed Georgia/Times New Roman and Arial/Helvetica/sans-serif. No font files distributed. |

The owner supplied the Amsterdam clock screenshot as a conceptual reference for the frosted face and painter action. The screenshot and its captions are not runtime assets. No existing Matisse painting is reproduced.

The approved stills are in `docs/painted-cast/` and `docs/art-review-v2/`. Exact prompts are recorded in each folder's `PROMPTS.md`. Raster extraction preserves transparency. The runtime trims transparent margins when drawing each character; it does not substitute the earlier vector artwork.

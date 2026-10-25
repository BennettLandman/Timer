# Asset provenance

All shipped visuals and sounds are original to this project. No external media, commercial fonts, copied artwork, recordings, sprite packs, or stock audio are included.

| Asset | Implementation | Provenance |
| --- | --- | --- |
| Cat with beret, red fish, fishbowl, 24 additional species | `src/art.js` | Original vector paths using a shared color palette and line treatment. Inspired by the requested Matisse aesthetic; no existing painting is reproduced. |
| Frosted glass, minute painting, scratches, glass shards | `src/scenes.js` | Original procedural drawing and animation. The cat's painting/erasing concept follows the supplied discussion of the Amsterdam airport clock. |
| Clock blocks, falling pieces, debris | `src/scenes.js` | Original vector shapes and procedural motion. |
| Ticking, end shimmer, ambient chords | `src/audio.js` | Original oscillator synthesis using the browser's Web Audio API. No audio files or recordings. |
| Typography | CSS system font stacks | Installed Georgia/Times New Roman and Arial/Helvetica/sans-serif; no font files distributed. |

Cast: cat, dog, panda, turtle, pig, bear, cow, fish, eagle, turkey, raven, rabbit, fox, deer, horse, sheep, goat, elephant, giraffe, zebra, lion, penguin, owl, frog, hedgehog.

The project is private. No public reuse license is granted by this ledger.

## Revised painted proofs (not integrated into the application)

The owner superseded the vector character direction. `docs/art-review-v2/` contains built-in image_gen single-frame proofs for a painted beret cat with red fish, frosted-glass clock, and deep digital block sockets. These generated painting proofs are pending approval. They are not production sprite sheets or layered runtime assets. Their exact prompts are recorded in `docs/art-review-v2/PROMPTS.md`. Existing running-app assets in the table above remain functional drafts.

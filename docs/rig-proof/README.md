# Character motion studies

These development pages exercise the same cat and fox modules used by the timer. Serve the repository locally as described in the [developer guide](../DEVELOPMENT.md). The pages are excluded from the production website.

| Page | Purpose |
| --- | --- |
| [motion.html](motion.html) | Cat acting, fox walking, playback speed, seeking, and front/quarter/elbow camera views |
| [little-breaks.html](little-breaks.html) | All 24 cat diversions and the final 59 → 0 scratch sequence through the actual glass renderer |
| [friendly-review.html](friendly-review.html) | Historical comparison of facial and character appearance |

The models use continuous 3D geometry and skeletal motion. Painted pigment is mapped onto their surfaces. Glass uses a separate texture-and-blur treatment.

Run `npm run test:rig` from the repository root to check elbow and wrist constraints, planted feet, fox stance, claw contact, loop closure, deterministic seeking, pause, and mobile layout. Production choreography and the other animals have separate checks; see [testing coverage](../../QA.md).

See [ASSETS.md](../../ASSETS.md) for material provenance and the bundled Three.js license. Historical screenshots in this directory record earlier visual reviews.

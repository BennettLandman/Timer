# Approved painted artwork

On October 25, 2026, the owner approved the painted cat/fish style and both clock material proofs, then approved the four sheets below before animation integration. The previous vector character direction is superseded.

The application now uses transparent painted raster artwork for all 25 species, a separate frosted-glass texture, perspective-projected solid blocks and sockets, and articulated raster motion. The approvals are recorded in the conversation. No further artwork approval is pending for this cast.

## Master style and clock treatments

- [Cat and red fish painting](docs/art-review-v2/painted-cat-and-fish.png)
- [Frosted-glass reference proof](docs/art-review-v2/frosted-glass-clock.png)
- [Digital depth reference proof](docs/art-review-v2/depth-clock.png)

The proofs establish style and materials; the functioning clocks are rendered separately so hands, segment depth, text, and timing can change accurately.

## Approved remaining character stills

![Dog, panda, turtle, pig, bear, cow](docs/painted-cast/sheet-1.png)

![Fish, eagle, turkey, raven, rabbit, fox](docs/painted-cast/sheet-2.png)

![Deer, horse, sheep, goat, elephant, giraffe](docs/painted-cast/sheet-3.png)

![Zebra, lion, penguin, owl, frog, hedgehog](docs/painted-cast/sheet-4.png)

## Updated animation treatment

The owner requested more realistic anatomy and rejected image warping. The renderer now uses 24 actual painted poses per gait or action, with separate cat painting, claw-scratching, walking, and peeking sequences. Complete character poses are played directly; no mesh deformation remains. The style and character identities follow the approved stills.

The final-minute claw stroke is synchronized to a new set of three glass scratches each second. The cat steps between strokes after retracting its paw. The last stroke continues until the glass-break deadline. Before the last minute, the cat uses its forepaw to erase and its coordinated body/tail sequence to paint.

The digital housing retains its running position, dimensions and socket layout at completion. The red-capped cat emerges above the unchanged top edge with actual panel occlusion. The completion caption is placed below the housing to leave the head visible.

[Animation prompts](docs/ANIMATION_PROMPTS.md), [initial still prompts](docs/painted-cast/PROMPTS.md), and [proof prompts](docs/art-review-v2/PROMPTS.md) record built-in image-generation usage.

## Final 3D implementation approved — October 26, 2026

After selecting actual painted 3D animation, the owner approved the continuous cat/fox motion, elbow correction, and friendlier faces, then requested completion of the project. Timer 2.0.0 integrates those models and extends the same materials and facial language across the 25-species cast. It generates no new image pose sequences. The older raster approvals above remain as a historical record. The updated application and cast captures are `docs/setup.png` and `docs/characters.png`.

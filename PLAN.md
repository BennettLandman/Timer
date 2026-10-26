# Timer — completed application scope

The attached discussion supplied product ideas, not instructions to invoke services mentioned in it. The owner’s subsequent decisions govern this implementation.

## Confirmed decisions and delivery

- Name: Timer. Repository: `BennettLandman/Timer`, private. The owner will host the static site; no public deployment.
- JavaScript website with analog and digital scenes, presets/custom time, pause/resume, restart, cancel, added time, fullscreen, keyboard controls, saved settings, and accessible announcements.
- Deadline-based timing independent of animation. Red is capped at one minute; yellow lasts twice red. For original duration D, R = min(60, D/6), with yellow starting at 3R and red at R.
- Sound defaults to silent. Independent end sound, ticking, ambient tones, master mute, and volume. Default glass-break ending, optional gentle ending, and reduced motion.
- Analog: textured frosted glass, exact readout, brushed countdown hands, a cat physically erasing/painting minute changes, and one claw-contact stroke at each elapsed second in the final minute, counting counter-clockwise from mark 59 down to mark 0. The last scratch leads to the break and artist reveal.
- Digital: solid segments with recessed sockets and depth insertion/ejection, bounded debris, 25 occasional animal cleaners, and an empty-clock ending with the beret cat peeking out. The housing remains fixed.

## Final animation strategy

The owner selected actual painted 3D characters after rejecting image-frame animation as jerky. The cat/fox appearance, continuous joints, anatomical motion, elbow correction, and friendlier faces were reviewed and approved. The owner then authorized finishing the project.

Version 2.2.0 uses that implementation in the main application. A single shared transparent WebGL surface renders continuous skinned models into the clock scenes. Fixed-length joints, one-elbow arm constraints, volume-preserving skinning, planted stance, and time-based pose evaluation replace all raster pose playback. The additional species use the same material and facial language with appropriate body proportions, ears, coat patterns, horns, shells, wings, fins, tails, and hind-leg hocks.

Claw and brush contact targets also drive the visible marks. The cat stands behind the glass plane and lowers its pelvis for low marks, keeping its supported feet planted. Painting starts immediately after Start, and the setup preview demonstrates the action. Visible inspection gestures, looks, and blinks continue behind the frosted surface between minute changes. Reach and withdrawal blend back to the resting pose. A shuffled 24-action deck adds one 8.5–10-second diversion in a quiet full minute: checking/tapping a wristwatch, stretching overhead, briefly balancing in a yoga pose, nibbling a fish-shaped biscuit, plus twenty additional grooming, resting, mime, reading, tea, investigation, and musical routines. Each gesture eases back into the current idle pose. Short intervals skip the diversion if it cannot finish at least three seconds before the next minute change. Diversions are silent, subdued behind the glass, disabled by reduced motion, and excluded from the final minute. The digital cat rises behind the unchanged housing, which provides the occlusion. All animation freezes with the timer when paused and respects reduced motion.

Visitors enter approximately once per minute with a minimum start spacing above 30 seconds. Most cross over 40 seconds; the turtle takes 90 seconds and the fish 24. A long turtle visit delays the next animal rather than overlapping it. Gait time follows distance traveled, with shorter strides for short legs. Visitors move debris only.

## Cast

Cat, dog, panda, turtle, pig, bear, cow, fish, eagle, turkey, raven, rabbit, fox, deer, horse, sheep, goat, elephant, giraffe, zebra, lion, penguin, owl, frog, and hedgehog. All 25 use continuous 3D motion, with more than 16 visibly distinct sampled poses in browser checks. There is no fixed frame-count ceiling.

## Delivery and evidence

The production build contains only static local resources, including its licensed Three.js runtime. The private-hosting archive and instructions accompany the source. Unit checks cover timing, phase rules, geometry, all 25 closed continuous skins, weights, and cat influence continuity. Browser checks cover full timer flows, contacts around all 60 marks, brush reach, fixed digital geometry, peeking, all visitor poses, planted feet, responsive layout, pause/background behavior, audio/settings, build subdirectory hosting, and absence of external requests. See QA.md for measured results and the scope of device verification.

The review pages remain available as development references and import the same shipping cat/fox code. Historical raster prompts and approved stills are retained as provenance; superseded runtime atlases have been removed.

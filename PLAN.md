# Classroom Timer — application plan

## Source and scope
Based on the supplied Animated Classroom Timer App Concept discussion. The discussion is product research, not an instruction to invoke tools or services named within it. The application has been implemented following the confirmed decisions; see README.md and QA.md for delivery and verification. Name: Timer. The discussion also suggested “Time to keep track of time”; retain that as a possible subtitle.

## Product
A simple JavaScript website for teachers, readable from the back of a classroom. Two views: a cat behind frosted glass and a digital clock made of falling blocks. Animation rewards an occasional glance without demanding attention. No accounts required.

## Teacher flow
Choose analog or digital, select 1, 5, 10, 15, or 30 minutes, or enter minutes and seconds. Set optional end sound, ticking, and ambient music, then Start. The countdown fills the viewport, with an explicit fullscreen control. Small, accessible controls offer pause/resume, restart, cancel, +3 minutes, +5 minutes, and custom added time. Controls remain discoverable by keyboard and touch.

## Timing and colors
Use one shared timer engine with idle, running, paused, and completed states. Derive remaining time from an absolute deadline rather than counting animation frames. Reconcile on tab visibility changes and return from sleep; document browser limitations on sounds while suspended. Pause freezes all timer-driven animation. Restart uses the originally chosen duration; added time extends the current run.

Warning periods are chosen automatically. Let D be the original duration in seconds: red lasts R = min(60, D / 6) seconds, and yellow lasts 2R seconds immediately before red. Thus yellow starts at 3R remaining. This keeps a green opening for short timers, caps red at one minute, and makes the yellow period twice as long as red. This clarification supersedes the discussion's five-minute example.

| Preset | Yellow begins at | Red begins at | Yellow duration |
| --- | --- | --- | --- |
| 1 minute | 0:30 | 0:10 | 20 seconds |
| 5 minutes | 2:30 | 0:50 | 100 seconds |
| 10 minutes | 3:00 | 1:00 | 2 minutes |
| 15 minutes | 3:00 | 1:00 | 2 minutes |
| 30 minutes | 3:00 | 1:00 | 2 minutes |

Use precise thresholds for custom durations, including those below a minute. Keep thresholds fixed when time is added, allowing the phase to return to green. Color is supplemented by readable time and a phase label.

## Analog scene
The central action is the shadow of a domestic shorthair cat physically painting and erasing the minute marks on frosted glass, following the theatrical idea of the painter clock at Amsterdam airport. The cat approaches the glass, paints the next countdown minute mark with its tail, and scratches/erases the old mark with its claws. Synchronize the visible marks to the cat's contact and stroke, so the clock appears to be made by the cat. A generic rotating hand or disappearing arc is not the intended centerpiece. Keep the remaining duration readable throughout transitions, including durations above 60 minutes.

Distance behind pale green, yellow, or red frosted glass controls silhouette softness. Rare stretches, naps, pounces, or a mouse chase remain faint and never obscure the clock.

During the final 60 seconds (or the available seconds of a shorter timer), accumulate one claw scratch per elapsed second. This scratch sequence is independent of the red phase threshold. At zero, the final scratch triggers the default stylized glass break and reveals a mildly guilty cat wearing a beret against a red completion scene. Provide an optional gentle completion alternative and reduced-motion rendering.

## Digital scene
Show minutes and seconds using dark block segments with shallow 3D depth. Changed segments eject forward, fall, and break into bounded debris; replacement segments slide in from behind. Warning blocks become dark orange, then red. Maintain legibility throughout transitions and keep debris below the digits.

Random animal visitors clear debris only, never the active clock. Target visits about once per minute, with a hard minimum interval of 30 seconds. Include 25 distinct species with at least 16 frames per movement cycle and left/right traversal support. Named species from the discussion: cat with beret, dog, panda, turtle, pig, bear, cow, fish, eagle, turkey, and raven. Proposed additions: rabbit, fox, deer, horse, sheep, goat, elephant, giraffe, zebra, lion, penguin, owl, frog, and hedgehog. Fish flop; birds may fly. At completion, clear the digits and reveal the beret cat behind empty digit containers, with a separate clear completion label.

## Art direction
Original character art reflecting the requested Matisse cat-and-red-fish aesthetic: confident simple contours, flattened shapes, warm paper texture, expressive organic forms, and restrained saturated accents. Keep animals immediately recognizable, with little fur detail and no exaggerated baby-like features. Use the same visual language across both views. Use the original cat, guilty beret pose, red fish, palette, and shared movement system consistently across the full cast. Keep the frosted scene subdued even when revealed character art is colorful. Record sources and licenses for every external asset.

## Audio and accessibility
Independent switches for end sound, optional rising-volume ticking, and ambient music. Default to silent. Begin audio only after a user gesture, cap volume, and offer a master mute. Ambient changes should gently signal phases. Use original or explicitly licensed music and effects, with an asset license ledger. Avoid loud or startling glass effects by default. Support reduced motion, large high-contrast digits, keyboard controls, visible focus, and screen-reader announcements at meaningful milestones rather than every second.

## JavaScript architecture
Implemented lightweight static application: native JavaScript modules, HTML/CSS, and Canvas vector paths for scalable characters, clocks, and effects. A dependency-free copy build replaces the proposed Vite build. A shared timer state drives independent analog/digital renderers, audio, and settings. Use requestAnimationFrame for rendering only. Cache settings locally; consider offline support after the core experience works. No server or personal-data collection is needed for the initial release. Deliver a local production build and hosting instructions to the user, who will host it privately after completion. Do not deploy or publish the website. Private access must be enforced by the eventual host; a private repository alone does not restrict access to deployed files. No application login is planned unless the hosting setup later requires it.

## Delivery sequence and acceptance
1. Timer and interface: both static views, presets/custom duration, controls, added time, fullscreen, phase changes. Verify pause/resume, exact completion, background return, long durations, and phase boundaries.
2. Art proof: approved cat and fish, readable analog/digital mockups, frosted silhouette and one walking/pushing animation. Review projected classroom readability and distraction level.
3. Analog implementation: minute painting, faint idle actions, final 60 scratches, completion reveal, gentle/reduced-motion variants. Verify pause and added-time behavior during the final minute; scratches reflect current remaining time.
4. Digital implementation: synchronized segment changes, bounded debris, cleanup visits, then all 25 animated species. Verify 16-frame minimum, traversal directions, visitor spacing, performance, and empty-container ending.
5. Audio and polish: independently controlled sound options, phase cues, responsive/touch layout, keyboard and reduced-motion behavior.
6. Release verification: current desktop Chrome, Safari, Firefox, and Edge plus tablet checks; projector readability, repeated cycles, low-powered classroom computer performance, and licensed asset audit. Deliver the verified build for private hosting by the user; do not deploy.

## Confirmed decisions
- Use Timer as the app name.
- Keep the repository private; the user will host the finished site privately.
- Choose warning times automatically; red never exceeds one minute and yellow lasts two to three times as long as red (use twice by default).
- Glass breaking is the default visual ending; sound remains optional.
- The analog clock is painted and erased by the cat shadow at the glass.

## Artwork approval gate
The owner requires approval of a single still frame of each artwork before producing further animation frames. Existing artwork and motion studies are drafts. See ART_REVIEW.md. Further animation production is paused pending approval.

## Revised visual direction (October 25, 2026)
The owner rejected vector character art in favor of compelling high-quality paintings. Use consistent painted raster characters; preserve the existing timer behavior. Digital segments require substantial three-dimensional depth, recessed sockets, and insertion/ejection along the depth axis. The supplied Amsterdam clock reference clarifies painted analog hands on textured, translucent frosted glass with the cat working behind it. See ART_REVIEW.md for revised single-frame proofs. Obtain style approval, then approval of each remaining character still, before generating animation sequences.

## Approved painted implementation
The owner approved the master paintings and then all four remaining character still sheets before their animation. All 25 painted species are integrated through transparent raster atlases and articulated meshes. The old vector character renderer has been removed. The analog renderer now uses textured frosted glass and painted countdown hands. Digital segments are projected solids that traverse the socket depth before falling. No artwork approval is pending.

## Anatomy and completion revision
At the owner's request, all mesh warping has been replaced by 24-pose painted animation sequences. Separate cat actions provide anatomical forepaw/claw scratching, tail painting, gait and peeking. The final-minute strokes leave visible scratch marks during contact, and the final stroke reaches the glass-break deadline. The digital housing remains at its running geometry while the red-capped cat rises behind it. Frame registration is prepared in advance rather than computed during playback.

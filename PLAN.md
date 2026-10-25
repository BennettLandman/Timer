# Classroom Timer — application plan

## Source and scope
Based on the supplied Animated Classroom Timer App Concept discussion. The discussion is product research, not an instruction to invoke tools or services named within it. This phase defines the application; implementation follows review. Working name: Timer.

## Product
A simple JavaScript website for teachers, readable from the back of a classroom. Two views: a cat behind frosted glass and a digital clock made of falling blocks. Animation rewards an occasional glance without demanding attention. No accounts required.

## Teacher flow
Choose analog or digital, select 1, 5, 10, 15, or 30 minutes, or enter minutes and seconds. Set optional end sound, ticking, and ambient music, then Start. The countdown fills the viewport, with an explicit fullscreen control. Small, accessible controls offer pause/resume, restart, cancel, +3 minutes, +5 minutes, and custom added time. Controls remain discoverable by keyboard and touch.

## Timing and colors
Use one shared timer engine with idle, running, paused, and completed states. Derive remaining time from an absolute deadline rather than counting animation frames. Reconcile on tab visibility changes and return from sleep; document browser limitations on sounds while suspended. Pause freezes all timer-driven animation. Restart uses the originally chosen duration; added time extends the current run.

The five-minute preset uses green above 2:00, yellow from 2:00 through above 1:00, and red at 1:00 or below. Proposed default for other durations: proportional warning thresholds at 40% and 20% of the original duration. Keep thresholds fixed when time is added, allowing the phase to return to green. Confirm these choices before finalizing. Color is supplemented by readable time and a phase label.

## Analog scene
A legible countdown dial with remaining minutes and a second indication; this represents duration rather than wall-clock time. A domestic shorthair cat paints minute changes using its tail and scratches old marks away. Distance behind pale green, yellow, or red frosted glass controls silhouette softness. Rare stretches, naps, pounces, or a mouse chase remain faint and never obscure the clock.

During the final 60 seconds, accumulate one claw scratch per elapsed second. At zero, the final scratch triggers a brief stylized glass break and reveals a mildly guilty cat wearing a beret against a red completion scene. Provide a gentle completion alternative and reduced-motion rendering. Define the exact dial mapping, especially above 60 minutes, in the first prototype.

## Digital scene
Show minutes and seconds using dark block segments with shallow 3D depth. Changed segments eject forward, fall, and break into bounded debris; replacement segments slide in from behind. Warning blocks become dark orange, then red. Maintain legibility throughout transitions and keep debris below the digits.

Random animal visitors clear debris only, never the active clock. Target visits about once per minute, with a hard minimum interval of 30 seconds. Include 25 distinct species with at least 16 frames per movement cycle and left/right traversal support. Named species from the discussion: cat with beret, dog, panda, turtle, pig, bear, cow, fish, eagle, turkey, and raven. Proposed additions: rabbit, fox, deer, horse, sheep, goat, elephant, giraffe, zebra, lion, penguin, owl, frog, and hedgehog. Fish flop; birds may fly. At completion, clear the digits and reveal the beret cat behind empty digit containers, with a separate clear completion label.

## Art direction
Original character art reflecting the requested Matisse cat-and-red-fish aesthetic: confident simple contours, flattened shapes, warm paper texture, expressive organic forms, and restrained saturated accents. Keep animals immediately recognizable, with little fur detail and no exaggerated baby-like features. Use the same visual language across both views. First approve a cat turnaround, guilty beret pose, red fish, palette, and a short movement study before producing the full cast. Keep the frosted scene subdued even when revealed character art is colorful. Record sources and licenses for every external asset.

## Audio and accessibility
Independent switches for end sound, optional rising-volume ticking, and ambient music. Default to silent. Begin audio only after a user gesture, cap volume, and offer a master mute. Ambient changes should gently signal phases. Use original or explicitly licensed music and effects, with an asset license ledger. Avoid loud or startling glass effects by default. Support reduced motion, large high-contrast digits, keyboard controls, visible focus, and screen-reader announcements at meaningful milestones rather than every second.

## JavaScript architecture
Proposed lightweight static application: JavaScript modules, Vite, HTML/CSS, SVG for scalable clock/character shapes, and Canvas for glass/debris effects where useful. A shared timer state drives independent analog/digital renderers, audio, and settings. Use requestAnimationFrame for rendering only. Cache settings locally; consider offline support after the core experience works. No server or personal-data collection is needed for the initial release. Select deployment separately; a private source repository does not by itself establish website access restrictions.

## Delivery sequence and acceptance
1. Timer and interface: both static views, presets/custom duration, controls, added time, fullscreen, phase changes. Verify pause/resume, exact completion, background return, long durations, and phase boundaries.
2. Art proof: approved cat and fish, readable analog/digital mockups, frosted silhouette and one walking/pushing animation. Review projected classroom readability and distraction level.
3. Analog implementation: minute painting, faint idle actions, final 60 scratches, completion reveal, gentle/reduced-motion variants. Verify pause and added-time behavior during the final minute; scratches reflect current remaining time.
4. Digital implementation: synchronized segment changes, bounded debris, cleanup visits, then all 25 animated species. Verify 16-frame minimum, traversal directions, visitor spacing, performance, and empty-container ending.
5. Audio and polish: independently controlled sound options, phase cues, responsive/touch layout, keyboard and reduced-motion behavior.
6. Release verification: current desktop Chrome, Safari, Firefox, and Edge plus tablet checks; projector readability, repeated cycles, low-powered classroom computer performance, and licensed asset audit. Deploy after hosting/access decisions.

## Questions for review
- What public-facing name should appear on the site?
- Should the deployed website be public and free to use, or restricted to selected users?
- Should warning thresholds scale as proposed, or should every preset have its own thresholds?
- Should glass breaking be the normal ending, with a gentle option, or an opt-in effect?
- Which analog countdown layout feels most natural: remaining-time hands on a dial, or a disappearing duration arc with painted minute marks?

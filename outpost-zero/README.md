# OUTPOST ZERO

A self-contained lunar outpost mission trainer for NASA Space Apps Challenge 2026, **Build a Junior Astronaut Mission Trainer**. Students command four crew members for 15 two-day turns (about 30 Earth days), balancing air, water, food, power, shielding, materials, and crew health. The game is designed to make engineering trade-offs visible while keeping scientific simplifications clear.

## Run the game

Double-click `index.html` in a modern browser. It uses classic scripts and local files only: there is no build step, package installation, CDN, or network request. In this environment, the currently running local preview is [http://127.0.0.1:3000](http://127.0.0.1:3000). The preview is temporary and requires its local server process to remain running.

Choose Rookie, Cadet, or Commander and enter a seed. The page reads `?seed=VALUE` for shareable runs; the report also provides a copy-seed link. Choose actions, set life-support modes and power priorities, then resolve a turn. `G` resolves the turn, `1–9` activates an action, arrow keys move between focused action cards, `Tab`/`Enter` use controls, and `Escape` closes dialogs. Preferences are stored individually in `localStorage` inside try/catch; mission progress stays in memory.

## Gameplay and learning

- Fifteen-turn mission across sunlit turns 1–5, lunar night turns 6–12, and sunrise turns 13–15.
- Three difficulty tiers share one simulation engine, plus a locked Mars card.
- Construction queues, excavation, battery charge/capacity, system reliability and failure, repair and gamble actions, power priorities, scrubber modes, greenhouse modes, storms, shielding, crew health, and Rookie rescue.
- Dashboard, lunar habitat illustration, resource meters, night-energy forecast, seeded event forecast, mission goals, and turn debrief.
- Flow Map links are rendered from the current simulation's recorded cause-and-effect edges. Explanations trace those recorded edges to the meters that changed.
- Predictions, danger quizzes, Pip tutorial/narration, 21-entry Space Codex, teacher guide, seed comparison, and mission report with reference-strategy comparisons.
- High contrast, large text, mute and volume, optional speech narration, reduced-motion CSS, visible keyboard focus, and responsive layout.

All numeric values are **simplified game units**, not lunar engineering specifications. Codex references marked for verification are listed in `SOURCES.md`; they have not been externally fact-checked for this build.

## Simulation and replay

`js/rng.js` implements the seeded generator. `js/sim.js` is a DOM-free state transition engine. `js/data.js` holds tier settings and shared reference data. `js/bots.js` runs deterministic reference strategies. `js/ui.js` and `js/audio.js` provide the browser interface and generated Web Audio. Script order in `index.html` supports both `file://` and a local HTTP server.

The state includes the seed, schedule, actions, and turn history. The simulator records actual energy and resource dependency edges each turn; the UI draws those edges and `traceRootCause()` walks them to create explanations. Replay tests compare results for the same seed, tier, and actions. Environmental and failure randomness comes from the simulation RNG, not the UI.

## Testing

Run from the project directory:

```text
node tests/sim.test.js
node tools/balance.js
```

The assertion suite passed for deterministic replay, state validation, construction and battery timing, repairs, offline output, atomic invalid actions, power priorities, forecasts and prediction limits, causal explanations, Rookie rescue, and reference strategy replays. The balance script runs 2,000 seeds per strategy per tier (54,000 missions total); it is intentionally long-running.

## Final measured balance

Actual run on 2026-11-14; the script ran 2,000 missions for each of nine strategies across three tiers (54,000 total). A win means at least two crew survive with average health of at least 40. The requested balance bands are met: Rookie Balanced is above 85%; Cadet Balanced is 45–75%, no fixed Cadet strategy exceeds 85%, three Cadet strategies land between 10–80%, and Commander Balanced is 20–50%.

| Strategy | Rookie | Cadet | Commander |
|---|---:|---:|---:|
| Do-Nothing | 0.0% | 0.0% | 0.0% |
| Random | 99.0% | 0.0% | 0.0% |
| Solar-Heavy | 0.0% | 0.0% | 0.0% |
| Battery-First | 0.0% | 0.0% | 0.0% |
| Shield-First | 100.0% | 0.0% | 0.0% |
| Greenhouse-First | 100.0% | 0.0% | 0.0% |
| Balanced | 100.0% | 54.7% | 23.1% |
| Bury Early | 100.0% | 61.2% | 19.2% |
| Bury Late | 100.0% | 58.9% | 19.9% |

For the Balanced strategy, average final health was 100.0 (Rookie), 26.7 (Cadet), and 12.3 (Commander); survival rates (at least two crew alive) were 100.0%, 62.0%, and 31.6%. Low average health among wins reflects the minimum win threshold, and this is a bot measurement rather than an estimate of student performance. The tier failure settings were tuned to reach the requested strategy bands; they are gameplay parameters, not real equipment reliability estimates.
## Documentation

- `TEACHER_GUIDE.md`: classroom learning goals, 15-minute lesson, seed sharing, comparison, and discussion prompts.
- `SOURCES.md`: science references and verification checklist.
- `DEMO_SCRIPT.md`: timed two-minute presentation.

AI assistance disclosure: this project was built with AI coding assistance; the team must adapt this disclosure to the Space Apps rules.

## Known incomplete or unverified items

- The measured strategy balance targets are not met; see the table above.
- Browser automation confirmed the title/setup page loads from the local server. A complete 15-turn browser run on all tiers, browser console inspection, phone-width review, and assistive-technology checks were not completed. Node tests do not substitute for these checks.
- WCAG AA contrast and full screen-reader/keyboard compliance have not been certified. Some visual game elements are illustrative rather than live system animations.
- Game mechanics are simplified educational abstractions. Scientific claims and source pages require team verification before submission.

## Future work

Mars missions with dust storms; temperature control; crew morale; communication delay; ice mining; micrometeorite expansion; additional languages.


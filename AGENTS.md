# Documentary Motion Graphics Engine

## Goal
Build professional documentary-style motion graphics in Remotion at 1920x1080, 30fps.

## Visual language
- Cinematic dark editorial look
- Restrained gold accent (#d7b56d) with warm off-white typography
- Large serif documentary headlines + clean sans-serif metadata
- Slow camera pushes, deliberate easing, subtle grain and vignette
- Animated maps, routes, timelines, lower thirds and data graphics
- Avoid gimmicky transitions; motion should support storytelling

## Core composition
- `CinematicDocumentary` is the current visual showcase.
- Duration: 450 frames (15 seconds)
- Resolution: 1920x1080
- FPS: 30

## Agent rules
1. Inspect the existing Remotion code before adding dependencies.
2. Reuse existing components/utilities where practical.
3. Keep compositions deterministic and render-safe.
4. Never create dimensions other than 1920x1080 unless explicitly requested.
5. Prefer SVG/CSS/Remotion primitives when external assets are not available.
6. For maps, use real GeoJSON/topojson when geographic accuracy matters; clearly treat abstract maps as illustrative.
7. Keep text readable at 1080p and safe for YouTube.
8. Verify TypeScript/build before claiming a render is ready.

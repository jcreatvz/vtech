# Design and implementation notes

Design owned by JC Lutao. © 2026 JC Lutao. Original Versatile Techno branding, copy, source imagery, fonts, Spline technology and other third-party materials retain their respective ownership and licenses. This credit does not transfer third-party rights.

## Visual system

Near-black #070b10; icy blue #a8dfff; original Geist font and vector logo. Full-width sections with 18–100px fluid gutters. Hero copy sits above a slightly overlapping 3D canvas on desktop; mobile places a full-width 70svh canvas behind the copy with a readability gradient.

## Motion

- Hover transitions use explicit properties and 450–700ms easing.
- Projects separate slow 20-second image drift from 1.4-second pointer parallax. Drift pauses outside the viewport. Original utility scale effects are reset to prevent snapping.
- Original typemark artwork is split into nine letter paths. Entrance proceeds left to right; exit reverses after scrolling 24px. Returning to the top restores it. Its layout footprint remains reserved to prevent navigation jumps.
- Below-fold items are armed before observation and revealed once in local section order. Already-visible items are not hidden again. Keyboard focus and reduced-motion reveal content immediately.
- The loader dismisses on font readiness or a short deadline, never waits for the 15.7MB scene, and has a CSS/JS timeout escape. No-JavaScript browsing keeps content visible.
- A few sections have low-opacity, slow blue lighting effects. Reduced-motion disables drift, lighting motion and entrance transitions.

## Spline framing

Official runtime 2.0.111 loads the unchanged supplied scene. Desktop renders at 1200×900 and scales uniformly to fit. Mobile uses a 900px-wide portrait render viewport sized to the 70svh container; both CSS axes share one uniform scale. This avoids aspect-ratio distortion; it cannot change camera composition authored inside Spline. For different artistic framing, edit the Spline camera itself. No expanded scene dialog or scene-toolbar remains. A keyboard-focusable pause button is visually hidden during normal successful rendering; load/retry appears only for opt-in or failure states.

## Scope and known limits

This repository is the complete static redesign preview, not the unavailable original Next.js application. All secondary routes and forms link to vtechno.ca. Source images may still load from their original external URLs; internet access is required for those and the official Spline runtime. No backend, private integrations or original application code is included.

The QA browser disables WebGL. CSS stage ratio and responsive layout can be verified, but successful scene rendering, authored camera composition and real GPU performance require a WebGL-capable device. Optimize the scene in Spline before making performance guarantees. Legacy reconstruction scripts are retained only for provenance and require BeautifulSoup; running them overwrites final HTML changes.

## Current validation

Content/link/metadata preservation and JavaScript syntax checks passed. Browser checks covered widths 320, 390, 768, 1024 and the 1363px desktop viewport with no horizontal overflow. The canvas retained its 4:3 ratio. The header changed to icon-only after scroll; project images were visible and drifting with no pending hidden blocks in view. The page loader dismissed. The browser again reported unavailable WebGL, so scene rendering remains unverified.

## Latest refinements

Refreshed published scene SHA-256: ed506348f4f774de66c6def0b8b79dcc5bc83b02eab6e61e3ffb2f4822cd5c53. Runtime stays at export version 2.0.111. FAQ height/opacity and desktop dropdown animations are interruptible; menu dialogs wait for their actual exit animation before closing. Reduced-motion bypasses those animations. Free Consultation hover transitions use explicit properties.

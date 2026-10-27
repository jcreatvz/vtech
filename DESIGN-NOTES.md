# Design notes

Design owned by JC Lutao. © 2026 JC Lutao. Existing Versatile Techno branding, text, images, font and third-party technology retain their respective ownership and licenses.

The design uses near-black #070b10, icy-blue #a8dfff, Geist, original vector branding, full-width sections and fluid gutters. The right-side hero visual overlaps behind the copy on desktop. Mobile places a full-width 70svh scene behind a readability gradient and clickable CTAs.

## Hosted Spline

Use the supplied public Spline URL in the official iframe embed. Do not download or reconstruct the binary scene. No local runtime dependency or camera resize code is needed. The iframe has no border, mask, CSS scale or toolbar. The Spline page owns its responsive camera. Publish scene changes in Spline; browsers may require a refresh to obtain the latest export.

Cross-origin iframe rendering cannot be inspected or paused by the parent page. Reduced-motion and data-saving users opt in before it loads. An iframe load event confirms the frame document loaded, not successful GPU rendering. The test browser previously disabled WebGL; validate the authored scene on a WebGL-capable device. Mobile pointer events stay disabled to preserve normal page scrolling.

## Motion and accessibility

Original logo paths enter letter by letter, reverse to an icon-only header on scroll, and return at the top. Project images separate slow drift from pointer parallax. Hover properties transition explicitly. FAQ height/opacity and navigation dropdowns animate in both directions. Dialog exits await animation completion before hiding; reduced-motion skips animation. Review cards stay fixed height with full copy in a separate dialog. The loader does not wait for the Spline scene.

## Source and deployment

GitHub Pages serves root index.html with relative assets/ paths, so /vtech/ works directly. The private Sites preview uses matching files inside its dist/ deployment folder. Keep those website files synchronized. Do not reintroduce the removed scene parts, restoration scripts or historical generators.

This is a static homepage preview, not the original Next.js app. Preserve source copy, links and metadata; port visual components into the actual application before replacing production functionality.

## Consultation background and tablet framing

The consultation background adapts the user-supplied “Many Thin Light — Originkit” shader, retaining its exact fragment shader and supplied dark-blue/black preset. The standalone WebGL2 module avoids adding React, caps rendering at 30fps and 1.4 million pixels, pauses offscreen/when hidden, and renders a still frame for reduced-motion. A dark-blue CSS gradient remains when WebGL2 is unavailable. Decorative canvas cannot intercept links. The CTA uses one smooth transform scale (1 to 1.025) with a 550ms ease; independent utility scaling remains disabled. The shader uses the original bottom-to-top vertical direction (uDirMode=3) and a gently eased apex offset for scroll/pointer parallax. Reduced-motion disables parallax and CTA scaling.

At 701–1366px, the hero visual fills the grid row with 100% height and no imposed aspect ratio. The mobile hero-copy pseudo-element is removed at 700px and below. Original content and metadata checks and both JavaScript syntax checks pass; GPU rendering requires a WebGL-capable browser.

## Vector mark and loader

assets/logo.svg traces the original V/T icon with a white V face, blue border and shaded blue T. The header uses this vector face with twelve blue SVG depth slices in CSS 3D. Crossing 24px of downward scroll triggers a single 1.35-second spin with a slight overshoot and vertical bounce; the depth slices disappear as the mark settles flat. Returning to the top re-arms the next downward spin. This does not add Three.js or another GPU renderer. Reduced-motion skips the spin.

The page intro now uses the vector asset and runs for 4.7 seconds from its inline boot timestamp, including a fade in the last 10%. Its duration does not depend on Spline loading. Reduced-motion keeps the mark static during the same interval. The consultation shader focal point is centered at (0.5, 0.5) in its rotated coordinate system; small eased parallax offsets remain around that center.

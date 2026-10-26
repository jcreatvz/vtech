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

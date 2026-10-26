---
name: vtechno-design
description: Maintain JC Lutao's Versatile Techno website redesign, including responsive layout, Spline, navigation, project motion, logo animation and preserved business content. Use when updating this repository or porting its design to the original application.
---

# VTechno design maintenance

Read the repository README.md and DESIGN-NOTES.md before editing. Edit root index.html and assets/ in GitHub; the Sites checkout keeps the matching website files under dist/. Keep both deployments synchronized. Historical generators and scene reconstruction scripts have been removed.

Preserve original copy, metadata, logo vectors, destinations and review text. Keep the near-black and icy-blue visual identity, full-width sections, restrained spacing and readable typography. Credit design ownership to JC Lutao; preserve third-party asset rights.

Keep stylesheet order original.css, redesign.css, immersive.css, polish.css. Modify the final layer for motion and composition. Avoid transition:all and independent scale utilities on project images. Use separate layers for pointer parallax and continuous drift.

Embed the supplied official Spline URL directly in an iframe. Do not download scene binaries, split assets, add restoration scripts or use a custom runtime. Preserve full-width 70svh mobile framing behind readable copy and clickable CTAs. Never stretch or crop the iframe. Respect reduced-motion/data-saving through explicit load. Cross-origin GPU state and animation playback are controlled by Spline.

Retain native dialogs for menu and full reviews, including keyboard close and focus restoration. Keep testimonial height fixed. Use one-time reveal sequences with per-section delays, and never hide visible content to restart an entrance. Ensure keyboard focus reveals pending content.

Run python verify.py and node --check assets/redesign.js (or dist/assets/redesign.js in the Sites checkout) after edits. Inspect phone, tablet, short landscape and wide desktop layouts, header scroll states, project hover and focus, dialogs, loader dismissal and overflow. Report WebGL limitations honestly.

For production integration, inspect the actual Next.js repository first. Port visual components and lifecycle cleanup into the existing framework; do not replace production routes or integrations with this static preview. Use the existing Sites identity and audience only when publishing this preview. Never package credentials or git authentication configuration.

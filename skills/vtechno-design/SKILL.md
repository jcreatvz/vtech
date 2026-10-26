---
name: vtechno-design
description: Maintain JC Lutao's Versatile Techno website redesign, including responsive layout, Spline, navigation, project motion, logo animation and preserved business content. Use when updating this repository or porting its design to the original application.
---

# VTechno design maintenance

Read the repository README.md and DESIGN-NOTES.md before editing. Treat dist/ as the editable, authoritative preview source. Do not run the historical prepare.py or upgrade.py generators: they predate the final motion layer.

Preserve original copy, metadata, logo vectors, destinations and review text. Keep the near-black and icy-blue visual identity, full-width sections, restrained spacing and readable typography. Credit design ownership to JC Lutao; preserve third-party asset rights.

Keep stylesheet order original.css, redesign.css, immersive.css, polish.css. Modify the final layer for motion and composition. Avoid transition:all and independent scale utilities on project images. Use separate layers for pointer parallax and continuous drift.

Keep desktop Spline on a 1200 by 900 stage. On mobile, render at a 900px width with portrait height matching the full-width 70svh container behind the hero copy. Scale both axes uniformly. Never stretch its CSS dimensions independently or crop its canvas. Keep hero CTAs above the scene. Keep normal scene controls visually absent, keyboard pause available, and error/opt-in control usable. Respect reduced-motion, data saving, visibility and viewport playback limits.

Retain native dialogs for menu and full reviews, including keyboard close and focus restoration. Keep testimonial height fixed. Use one-time reveal sequences with per-section delays, and never hide visible content to restart an entrance. Ensure keyboard focus reveals pending content.

Run python verify.py and node --check dist/assets/redesign.js after edits. Inspect phone, tablet, short landscape and wide desktop layouts, header scroll states, project hover and focus, dialogs, loader dismissal and overflow. Report WebGL limitations honestly.

For production integration, inspect the actual Next.js repository first. Port visual components and lifecycle cleanup into the existing framework; do not replace production routes or integrations with this static preview. Use the existing Sites identity and audience only when publishing this preview. Never package credentials or git authentication configuration.

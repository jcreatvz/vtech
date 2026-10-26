# Versatile Techno — JC Lutao redesign

Complete source for the static website redesign preview. Design owned by **JC Lutao**. See DESIGN-NOTES.md for ownership boundaries, motion, framing and technical notes.

## Run locally

Requires Python 3. No installation or build is needed:

```sh
python -m http.server 8080 --directory dist
```

Open http://localhost:8080. Internet access is required for external images and the official Spline runtime. Serve over HTTP; do not open index.html with file://.

## Files

- dist/index.html — editable homepage with original business content and links.
- dist/assets/original.css — retained source utility stylesheet.
- dist/assets/redesign.css — base visual design.
- dist/assets/immersive.css — full-width layout, mobile navigation and reviews.
- dist/assets/polish.css — final motion, logo, loader, lighting and canvas framing.
- dist/assets/redesign.js — interactions and Spline lifecycle.
- dist/assets/scene.splinecode — unchanged user-supplied published scene.
- reference/original.html — source snapshot for preservation checks.
- skills/vtechno-design/ — included project maintenance skill.
- verify.py — original content, metadata and destination comparison.
- prepare.py and upgrade.py — historical reconstruction scripts, not the current build pipeline. Do not rerun them over the final source.

## Check and deploy

```sh
python verify.py
node --check dist/assets/redesign.js
```

Upload dist/ to a static web host. The repository hosting manifest belongs to the existing private Sites preview; remove or replace its identity when deploying a separate copy. The download excludes credentials and Git internals. To create your own repository, run git init after extracting.

## Production integration

This is not the original Next.js repository. Other pages, forms and business integrations remain at vtechno.ca. Obtain the actual source, preserve its framework and routing, and port these visual layers into its existing components. Translate the JS lifecycle into client effects with observer/listener cleanup and Spline disposal on unmount. Keep original metadata exports, forms and backend behavior; do not replace the application with this static preview.

The original homepage copy, section inventory, title/description and link destinations are checked against the captured source. See DESIGN-NOTES.md for verification limits, particularly WebGL and mobile GPU performance.

## GitHub source

Canonical GitHub copy: https://github.com/jcreatvz/vtech. Download using Code → Download ZIP. The website lives in dist/; serve that folder directly. This repository includes the project maintenance skill and design notes.

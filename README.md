# VTech — Versatile Techno redesign

Design owned by **JC Lutao**. Website: https://jcreatvz.github.io/vtech/

## Run or deploy

The GitHub repository has `index.html` and `assets/` at its root. GitHub Pages serves **main / (root)**. No build, dependencies, scene reconstruction, or Spline file download is required.

Download with **Code → Download ZIP**, extract it, then run:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. The hosted preview's internal deployment folder is `dist/`; its website files match the root files on GitHub.

## Spline

The hero embeds the official scene directly:
https://my.spline.design/vtechn-UQCPEEbEaNxbvrPfKkg2JdcY/

Publish your changes in Spline to update that scene. No new file format is needed. The embed fills its container without CSS stretching; mobile uses full width and 70svh behind the hero copy. Spline controls its responsive camera and rendering. Reduced-motion and data-saving preferences require an explicit load. The surrounding page and CTAs never wait for the scene.

The old binary scene, 40 split files, reconstruction script, and historical page generators have been removed from the current repository. Git history retains previous versions.

## Project files

- `index.html` and `assets/`: website source.
- `skills/vtechno-design/`: project maintenance skill.
- `DESIGN-NOTES.md`: visual system, ownership and integration notes.
- `reference/original.html` and `verify.py`: business-content preservation check.

Run `python3 verify.py` and `node --check assets/redesign.js` after editing.

This remains a static homepage redesign. Other routes and forms link to vtechno.ca; its original Next.js application and backend are not included or replaced.

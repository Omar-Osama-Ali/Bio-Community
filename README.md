# BIO COMMUNITY Website

A responsive, multi-page static website built with HTML5, CSS3, and Vanilla JavaScript for GitHub Pages.

## Included
- Home, About, Experiments, Experiment Details, BIO Shorts, Microscopic World, Activities, Privacy & Media Information, and 404 pages.
- One supplied 77-second landscape video published as **Experiment 01**.
- Three supplied portrait videos published as the three Shorts associated with Experiment 01.
- Six experiment positions total, with Experiments 02–06 marked Coming Soon.
- Three Shorts positions per experiment (18 total), with future positions marked Coming Soon.
- Three supplied microscope images displayed under neutral observation labels pending specimen verification.
- School logo included as secondary institutional identity.
- Responsive navigation, native video playback, image viewer, reduced-motion support, SEO starter files.

## Important content verification
The source package does not include a confirmed experiment title, scientific objective, materials, procedure, observations, explanation, microscope specimen names, or magnification values. These fields are intentionally not invented. The live page uses the neutral label **Experiment 01** until the community supplies verified details.

The supplied portrait clips are used as the three associated Shorts based on the project brief. They are also shown in the Activities page because their filenames describe activity/learning moments. Remove them from either presentation if the school wants each media item used only once.

Before public launch, confirm permission for all identifiable student photos/videos and verify that the school logo is approved for web publication.

## Run locally
Because the site loads JSON using `fetch()`, open it through a local static server rather than `file://`.

Example:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## GitHub Pages deployment
1. Create or open the target GitHub repository.
2. Upload the contents of this folder to the repository root (not the enclosing folder).
3. In repository Settings → Pages, select **Deploy from a branch**.
4. Select the deployment branch (usually `main`) and folder `/ (root)`.
5. Save and wait for GitHub Pages to publish.
6. Replace placeholder URLs in `robots.txt` and `sitemap.xml` with the final GitHub Pages URL.
7. Update canonical URL metadata if/when the final domain is confirmed.

All page and asset references are relative, so the project supports deployment under a GitHub Pages repository subdirectory.

## Add a new experiment
1. Add the MP4 to `assets/videos/experiments/` (H.264 recommended).
2. Add a poster image to `assets/images/thumbnails/`.
3. Edit `data/experiments.json` and replace the matching Coming Soon record. Keep a unique `id`, set `status` to `published`, and fill only verified fields.
4. Set the `video`, `thumbnail`, and `shortIds` values.
5. The reusable experiment detail page works with `experiment.html?id=YOUR-ID`.

## Add its three Shorts
1. Add three portrait MP4 files to `assets/videos/shorts/`.
2. Add poster images to `assets/images/thumbnails/`.
3. In `data/shorts.json`, replace the three Coming Soon records reserved for that experiment.
4. Set each `parentExperimentId` to the exact experiment ID and `status` to `published`.
5. Add those three Short IDs to the experiment's `shortIds` array.

## Add microscope images and specimen details
1. Add the original image to `assets/images/microscopy/`.
2. Add a record to `data/specimens.json` with a unique ID, display name, image path, verified description, and optional magnification/observation notes.
3. Do not label a specimen or magnification until confirmed.

## Add activity photographs or videos
- Add approved media to `assets/images/activities/` or the relevant video folder.
- Add records to `data/activities.json`.
- Update `activities.html` only if a different media presentation is needed.

## Update branding
Replace files in `assets/images/branding/` with approved logo exports while preserving original proportions and appearance. Update filenames in the HTML if filenames change.

## Media and performance notes
- Full experiment video uses `preload="none"`.
- Videos are served directly from the repository. GitHub Pages is suitable for a small initial static site but is not a dedicated large-video CDN. If the media library grows substantially, move videos to approved external video hosting and update the JSON paths without changing the UI components.
- Keep compressed posters and responsive images reasonably sized.

## Known launch checklist
- Confirm actual experiment title and scientific content.
- Confirm which specimen is shown in each microscope image.
- Confirm school approval and media permissions.
- Replace sitemap/robots placeholder URLs.
- Test the published GitHub Pages URL on real phones.

# BIO COMMUNITY — Website

**Where Biology Comes to Life.** Discover. Explore. Experiment.

A static, multi-page educational website built with HTML5, CSS3, and Vanilla JavaScript for GitHub Pages.

## Project contents

- Home, About, Experiments, reusable Experiment Details, BIO SHORTS, The Microscopic World, Community Activities, Privacy & Media Information, and 404 pages.
- One published 77-second landscape experiment video.
- Three published portrait Shorts associated with Experiment 01.
- Six experiment positions total (Experiment 01 published; 02–06 Coming Soon).
- Exactly three Shorts positions for each of the six experiment records (18 total).
- Three authentic microscope images with neutral observation labels. Specimen identity and magnification remain unverified.
- BIO COMMUNITY logo and school logo supplied for the project.
- Responsive navigation, native video playback, accessible image viewer, content loading/error states, reduced-motion support, SEO metadata, sitemap, robots.txt, and llms.txt.
- Footer credit: Created by Omar Osama, linking to the portfolio site.

## Run locally

The website fetches JSON data files, so serve the project over HTTP instead of opening pages with `file://`.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deploy to GitHub Pages

1. Open the `Bio-Community` repository.
2. Upload the **contents** of this folder to the repository root. Do not upload the enclosing folder as another nested directory.
3. In repository **Settings → Pages**, choose **Deploy from a branch**.
4. Select the deployment branch (usually `main`) and folder `/ (root)`.
5. Save and wait for GitHub Pages to publish.
6. The site is configured for the project-site base path `/Bio-Community/`. Internal paths are resolved relative to each deployed page, so the site remains compatible with a repository subdirectory.

Public URL: https://omar-osama-ali.github.io/Bio-Community/

## Content configuration

All published content and reserved positions are managed in JSON files under `data/`.

### Add a full experiment

1. Add its MP4 to `assets/videos/experiments/` (H.264 MP4 recommended).
2. Add a representative poster to `assets/images/thumbnails/`.
3. Open `data/experiments.json` and replace the next Coming Soon record.
4. Keep a unique `id`; set `status` to `published`; fill the title, description, category, video, thumbnail, and duration.
5. Add only verified objective, materials, procedure, observations, and explanation text. The reusable page is `experiment.html?id=YOUR-ID`.

### Add exactly three Shorts

1. Add three portrait MP4 files to `assets/videos/shorts/` and three posters to `assets/images/thumbnails/`.
2. In `data/shorts.json`, replace the three reserved records belonging to that experiment.
3. Set each record's `parentExperimentId` to the exact experiment ID and `status` to `published`.
4. Add the three Short IDs to that experiment's `shortIds` array in `data/experiments.json`.
5. Confirm the three clips are the correct videos for that experiment. Each published Short automatically links to its parent experiment.

### Add microscope images

1. Add the original photograph to `assets/images/microscopy/`.
2. Add a record to `data/specimens.json` with a unique ID, neutral name if the specimen is not verified, image path, and accurate description.
3. Add magnification and preparation notes only when confirmed.

### Add community activity media

1. Add approved media to the appropriate assets directory.
2. Add its title, video path, and poster path to `data/activities.json`.
3. Do not add identifiable student media unless the appropriate permissions have been obtained.

## GitHub Pages paths and SEO

- Canonical URLs use the actual deployed site: `https://omar-osama-ali.github.io/Bio-Community/`.
- `robots.txt` points to the project-site `sitemap.xml`.
- The sitemap lists existing public pages and the currently published experiment detail route only.
- The dynamic experiment page updates its canonical URL based on the selected experiment ID and marks unpublished experiment routes `noindex`.
- Relative asset/data paths resolve from the project-site root, not the GitHub account root.

## Media and privacy notes

- Full experiment playback uses native MP4 video with `preload="none"`.
- Shorts are muted by default, user-initiated, and pause when scrolled out of view. Starting one Short pauses the others.
- Videos are compressed H.264 MP4 files with fast-start metadata. GitHub Pages is suitable for this initial small library but is not a dedicated video CDN; move large future media to an approved external host if the library grows significantly.
- The website has no login, registration, payment, analytics, advertising trackers, or non-essential cookies.
- Confirm school approval and permissions for all identifiable student photographs and videos before public distribution.
- Do not infer scientific facts, experiment results, specimen identities, or magnification values from the supplied media alone.

## QA performed for this delivery

- JavaScript syntax validation.
- JSON parsing for all content files.
- XML parsing for `sitemap.xml`.
- Local path/reference audit for HTML, CSS, JS, JSON, image, poster, and video assets.
- Video stream/duration checks for the published experiment and three Shorts.
- Static responsive/accessibility review of navigation, focus states, touch targets, reduced motion, image viewer controls, and error states.

A live browser-based Lighthouse run and GitHub Pages deployment cannot be claimed from this local package; run those checks after uploading the files to the repository.

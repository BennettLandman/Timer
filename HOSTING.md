# Hosting Timer

The public timer is available at **[bennettlandman.github.io/Timer](https://bennettlandman.github.io/Timer/)**. It runs entirely in the browser; no database, application server, API key, or account service is needed.

## GitHub Pages

[The deployment workflow](https://github.com/BennettLandman/Timer/blob/main/.github/workflows/pages.yml) publishes the site after every push to `main`. It runs the unit checks, builds with Node.js 24, and uploads only the production `dist/` directory. It can also be run manually from the repository’s Actions tab. The repository’s Pages publishing source is **GitHub Actions**.

The production site contains `index.html` and a content-versioned directory such as `src/<content-hash>/`. All runtime modules, styles, and artwork use that same directory. Its name changes when the application content changes, so a new page cannot reuse an older cached renderer. Relative paths support the `/Timer/` project address and other subdirectories. Development previews, tests, and reference artwork remain in the source repository and are excluded from the published site.

## Host your own copy

Download the static-site ZIP from the [release page](https://github.com/BennettLandman/Timer/releases/latest), or build from source with Node.js 18 or newer:

```sh
npm run build
```

No package installation is required. Upload the **contents** of `dist/` to a static web host, or extract the release ZIP into its web directory. Keep `index.html` and the complete `src/` directory together. Deploy them as one build.

Serve the site over HTTPS. JavaScript modules need a JavaScript content type, stylesheets need CSS, and `.skin` assets must be served as binary files, such as `application/octet-stream`. Do not redirect missing asset requests to an HTML fallback. No URL rewriting is required.

The application has no sign-in or access controls. If your copy needs restricted access, configure that on the host.

## Run locally

From the repository root or the extracted release directory, use Python 3:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open [http://127.0.0.1:8080/](http://127.0.0.1:8080/). This server is reachable only from the current computer. Opening `index.html` directly as a file does not support the application’s JavaScript modules.

## Loading and offline use

The production site is approximately 29 MB before transfer compression. The 25 character models and their shaders are prepared before **Start timer** becomes available. All runtime resources are included with the site; no fonts, scripts, or artwork are fetched from third-party services.

After loading, an active timer does not need further network requests. Timer does not install an offline service worker, so reopening the hosted address without a connection is not guaranteed. Use a downloaded copy and a local server when dependable offline access is needed.

WebGL 2 must be enabled. Device sleep or browser throttling can delay audio and visual updates; the remaining time reconciles with the deadline when the page becomes active again. Keep the classroom device awake and check volume, full screen, and projection before use.

## Release archive

To build the ZIP and its checksum from a checkout:

```sh
npm run build
npm run package:release
```

The files are written to `releases/Timer-<version>.zip` and `releases/Timer-<version>.sha256`. The package includes the production site, hosting guide, asset credits, source revision, and a per-file SHA-256 manifest. Packaging checks that the versioned runtime files match the source, verifies the rewritten entry paths in `index.html`, and validates the completed ZIP.

Settings are stored in browser local storage when available. The application has no analytics or application-side data collection.

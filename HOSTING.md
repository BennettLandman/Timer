# Hosting Timer

Timer 2.2.0 runs as static files. The public GitHub Pages address is [https://bennettlandman.github.io/Timer/](https://bennettlandman.github.io/Timer/).

## GitHub Pages

The repository uses GitHub Actions as its Pages publishing source. `.github/workflows/pages.yml` runs the unit checks, builds with Node.js 24, uploads only `dist/`, and deploys to the `github-pages` environment. Each push to `main` publishes the current build after the checks pass; the workflow also supports manual runs. Official deployment actions are pinned to verified commit hashes.

The build includes `index.html` and `src/`, with relative asset paths that work under `/Timer/`. It excludes development previews, historical artwork, tests, and documentation from the website. The public repository still contains the development source and history. No custom domain, secrets, server, or package installation is required.

## Another static host

1. Build with `npm run build` (Node.js 18+) or use the supplied production archive.
2. Copy the **contents** of `dist/` into your website directory. Keep `index.html` and the `src/` directory together. Relative links support hosting under a subdirectory.
3. If private access is needed on that host, configure its access controls. The website itself does not implement user accounts.
4. Serve over HTTPS, with `.js` files served as JavaScript and `.css` files as CSS. WebGL 2 must be enabled for the painted 3D characters. Serve `.skin` files as binary data (for example `application/octet-stream`); do not route these requests to an HTML fallback. No URL rewriting, database, API keys, application server, CDN, or third-party services are required.
5. Open the hosted site and try each clock with a short timer. Enable sounds with a user click and check volume on the classroom computer. Test fullscreen and projection before classroom use.

For a local-only preview, run `python3 -m http.server 8080 --bind 127.0.0.1` in the extracted website directory. This binds only to the current computer. Open `http://127.0.0.1:8080`.

The app has no remote resources. All 25 character assets are prepared before Start becomes available, so the active timer does not need additional network access. It does not install an offline service worker. Browser/device sleep can delay audio and visual callbacks. On returning to an active tab, the displayed time reconciles with the absolute deadline. Keep the classroom device awake when an end sound must occur on time.

Settings are kept in browser local storage when available. No student information or usage data is collected.

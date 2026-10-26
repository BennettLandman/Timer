# Private hosting handoff

Timer 2.1.0 is ready to serve as static files. No deployment has been performed.

1. Build with `npm run build` (Node.js 18+) or use the supplied production archive.
2. Copy the **contents** of `dist/` into your private website directory. Keep `index.html` and the `src/` directory together. Relative links support hosting under a subdirectory.
3. Configure access control on your host before allowing outside access. A VPN, reverse-proxy authentication, or your organization's existing access gateway can protect the entire directory. The website itself does not implement user accounts. A private GitHub repository does not protect an otherwise public web server.
4. Serve over HTTPS, with `.js` files served as JavaScript and `.css` files as CSS. WebGL 2 must be enabled for the painted 3D characters. Serve `.skin` files as binary data (for example `application/octet-stream`); do not route these requests to an HTML fallback. No URL rewriting, database, API keys, application server, CDN, or third-party services are required. Do not publish the repository through GitHub Pages.
5. Open the hosted site, confirm that access is private, and try each clock with a short timer. Enable sounds with a user click and check volume on the classroom computer. Test fullscreen and projection before classroom use.

For a local-only preview, run `python3 -m http.server 8080 --bind 127.0.0.1` in the extracted website directory. This binds only to the current computer. Open `http://127.0.0.1:8080`.

The app has no remote resources. All 25 character assets are prepared before Start becomes available, so the active timer does not need additional network access. It does not install an offline service worker. Browser/device sleep can delay audio and visual callbacks. On returning to an active tab, the displayed time reconciles with the absolute deadline. Keep the classroom device awake when an end sound must occur on time.

Settings are kept in browser local storage when available. No student information or usage data is collected.

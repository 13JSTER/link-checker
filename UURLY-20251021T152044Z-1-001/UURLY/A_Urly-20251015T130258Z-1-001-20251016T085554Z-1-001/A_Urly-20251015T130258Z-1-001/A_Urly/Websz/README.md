# Websz Dev + Local Link Scanner (No-API)

This project runs a React (Vite) site and a local, no-external-API link scanner.

## Quick start (Windows)

1) Install dependencies (once):
```
cd "C:\Users\Acer\Desktop\web\Websz-20250924T065155Z-1-001\Websz"
npm install
```

2) Start both servers (scanner + Vite):
```
npm run dev:all
```
- Scanner server: http://localhost:5050
- Vite dev server: will print the URL (e.g., http://localhost:5173 or http://localhost:5174)

3) Use the Link Safety Checker on the Home page. When you click "Scan Links":
- If the scanner server is running, results include HTTP/TLS/DNS info.
- If not, it falls back to browser-side heuristics only.

## Scripts
- `npm run dev` — start Vite only
- `npm run scan` — start local scanner only (http://localhost:5050)
- `npm run dev:all` — open a new window for scanner and start Vite in current window

## Notes
- If port 5173 is busy, Vite will auto-switch to 5174 (or another), shown in the console output.
- The scanner server uses Node's built-in `fetch`, DNS, and TLS APIs. No third-party reputation APIs.

## Google Safe Browsing (GSB)

The scanner integrates Google Safe Browsing (v4) for URL reputation.

- Where the key is read from: either environment variable `GOOGLE_SAFE_BROWSING_KEY` or `scanner.config.json`.
- Health check: `GET http://localhost:5050/health` will return `{ gsb: { enabled: true } }` when a key is present.
- The UI shows reputation badges:
	- `GSB: UNSAFE` when GSB flags the URL.
	- `GSB: UNSAFE (derived)` when the overall verdict is unsafe even if GSB didn’t explicitly flag it.
	- `GSB: SAFE` when GSB responds safe; `GSB: ERROR` on API errors/timeouts.

Run with a key via PowerShell:

```powershell
cd "C:\Users\Acer\Desktop\web\Websz-20250924T065155Z-1-001\Websz"
$env:GOOGLE_SAFE_BROWSING_KEY="YOUR_KEY_HERE"; npm run dev:all
```

Or set the key once in `scanner.config.json` (already supported) and run `npm run dev:all` normally.

## Fast results and denylist

- Early-exit fast mode: the scanner returns an immediate verdict on strong signals (local blocklist match, HTTP protocol, high heuristic score) without waiting for slow network checks.
- Local denylist: `feeds/local-denylist.txt` — add hosts or URLs here to force high risk instantly.
- Known phishing example included: `smartki.help` and `https://smartki.help/rewards`.

## Verify it’s working

1. Start both servers (`npm run dev:all`).
2. Open the site at the Local URL printed by Vite (e.g., `http://localhost:5178/`).
3. Scanner health: open `http://localhost:5050/health` — look for `"enabled": true` under `gsb`.
4. Test GSB: scan Google’s test phishing URL in the UI or via API:

	 ```powershell
	 curl -Method POST http://localhost:5050/api/scan -ContentType 'application/json' -Body '{"url":"http://testsafebrowsing.appspot.com/s/phishing.html"}'
	 ```

	 Expect `gsb.verdict` to be `unsafe`.

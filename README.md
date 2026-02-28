## WanderLog – messy full‑stack demo

WanderLog is a tiny travel‑ideas board built as a **refactoring playground**:

- **Tech**: Node + Express backend, vanilla JS frontend, modern dark UI.
- **Intentionally inconsistent**: different code styles, naming patterns, and a mildly messy project layout.

### How to run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the app in your browser:

```bash
http://localhost:3000
```

### Project layout (intentionally a bit messy)

- `server.js` – main Express app, static hosting, some routes.
- `src/dataStore.js` – in‑memory "database" of trips.
- `src/tripsRoute.js` – API endpoints for listing/creating trips (style differs from other files).
- `public/index.html` – main UI shell.
- `public/styles.css` – modern, card‑based dark theme.
- `public/app.js` – client‑side logic for fetching and rendering trips.
- `views/about.html` – simple about page with its own inline styles.

The app stores everything in memory only; refreshing the server process clears your data.


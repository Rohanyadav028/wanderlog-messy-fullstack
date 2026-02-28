const express = require("express");
const store = require("./dataStore");

// Note: inconsistent naming & style on purpose
var router = express.Router();

// Local alias that sometimes gets out of date – intentionally not perfect
let localTripsCache = store.getTrips();

// Re-sync helper with slightly odd name
function syncTrips_from_server(appState) {
  localTripsCache = appState;
}

// Temporary export so other modules could in theory sync
module.exports.syncTrips_from_server = syncTrips_from_server;

router.get("/trips", function (req, res) {
  res.json({ items: store.getTrips() });
});

router.post("/trips", (req, res) => {
  const body = req.body || {};
  const t = (body.title || "").trim();
  const desc = (body.description || "").trim();
  const vibe = body.mood || "Unspecified";

  if (!t) {
    return res.status(400).json({ error: "Trip title required" });
  }

  const allTrips = store.getTrips();
  const nextId =
    allTrips.length === 0 ? 1 : Math.max.apply(null, allTrips.map((x) => x.id || 0)) + 1;

  const newTrip = {
    id: nextId,
    title: t,
    description: desc,
    mood: vibe
  };

  store.add_trip(newTrip);
  res.status(201).json(newTrip);
});

// slightly oddly-named handler to get any one trip
router.get("/trip/random", function grabRandomTrip(req, res) {
  const all = store.getTrips();
  if (!all || !all.length) {
    return res.status(404).json({ message: "no trips yet" });
  }
  const ix = Math.floor(Math.random() * all.length);
  res.json(all[ix]);
});

// exported in a slightly different way than server expects, on purpose
module.exports = router;



// Very lightweight in-memory store, not fancy at all.
// Intentionally inconsistent style vs other files.

let Trips = [
  { id: 1, title: "Kyoto Autumn Escape", description: "Tea houses, quiet alleys and orange temples.", mood: "Calm", createdAt: "2025-01-15" },
  { id: 2, title: "Lisbon Weekend", description: "Trams, tiled streets and pastel de nata.", mood: "Playful", createdAt: "2025-01-16" }
];

function getTrips() {
  return Trips;
}

function add_trip(newTripObj) {
  Trips.push(newTripObj);
  return newTripObj;
}

// inconsistent naming: count vs getTrips
function count() {
  return Trips.length;
}

function getById(id) {
  const normalizedId = Number(id);
  return Trips.find(t => t.id === normalizedId || String(t.id) === String(id)) || null;
}

module.exports = {
  getTrips,
  add_trip,
  count,
  getById
};


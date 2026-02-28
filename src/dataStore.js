// Very lightweight in-memory store, not fancy at all.
// Intentionally inconsistent style vs other files.

let Trips = [
  { id: 1, title: "Kyoto Autumn Escape", description: "Tea houses, quiet alleys and orange temples.", mood: "Calm" },
  { id: 2, title: "Lisbon Weekend", description: "Trams, tiled streets and pastel de nata.", mood: "Playful" }
];

function getTrips() {
  return Trips;
}

function add_trip(newTripObj) {
  Trips.push(newTripObj);
  return newTripObj;
}

module.exports = {
  getTrips,
  add_trip
};


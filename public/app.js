// App entry – intentionally mixes styles & naming patterns.

const apiBaseUrl = "/api";

function fetchTrips() {
  return fetch(apiBaseUrl + "/trips").then(function (r) {
    if (!r.ok) throw new Error("Failed to load trips");
    return r.json();
  });
}

// slightly ad-hoc helper for random trip
function getRandomTrip() {
  return fetch(apiBaseUrl + "/trip/random").then(function (res) {
    if (!res.ok) {
      throw new Error("no random trip available yet");
    }
    return res.json();
  });
}

const TripUI = {
  rootEl: document.getElementById("trip-list"),

  render(tripsPayload) {
    const items = tripsPayload && tripsPayload.items ? tripsPayload.items : [];
    this.rootEl.innerHTML = "";
    if (!items.length) {
      this.rootEl.innerHTML =
        '<div class="muted" style="font-size:12px;padding:6px 2px;">No trips yet. Add your first idea.</div>';
      return;
    }

    items.forEach((trip) => {
      const card = document.createElement("article");
      card.className = "trip-card";

      const title = document.createElement("h3");
      title.className = "trip-title";
      title.textContent = trip.title || "(untitled)";

      const desc = document.createElement("p");
      desc.className = "trip-desc";
      desc.textContent = trip.description || "No description provided.";

      const meta = document.createElement("div");
      meta.className = "trip-meta";

      const moodChip = document.createElement("span");
      moodChip.className = "chip";
      const dot = document.createElement("span");
      dot.className = "chip-dot " + deriveDotClass(trip.mood);
      const txt = document.createElement("span");
      txt.textContent = trip.mood || "Unspecified";
      moodChip.appendChild(dot);
      moodChip.appendChild(txt);

      const idTag = document.createElement("span");
      idTag.className = "id-tag";
      idTag.textContent = "#" + trip.id;

      meta.appendChild(moodChip);
      meta.appendChild(idTag);

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(meta);

      this.rootEl.appendChild(card);
    });
  }
};

function deriveDotClass(mood) {
  switch (mood) {
    case "Calm":
      return "chip-dot--calm";
    case "Playful":
      return "chip-dot--playful";
    case "Adventurous":
      return "chip-dot--adventurous";
    case "Cozy":
      return "chip-dot--cozy";
    default:
      return "chip-dot--calm";
  }
}

async function loadTripsAndRender() {
  try {
    const data = await fetchTrips();
    TripUI.render(data);
  } catch (e) {
    console.error(e);
  }
}

function setupFormHandlers() {
  var f = document.getElementById("trip-form");
  if (!f) return;

  f.addEventListener("submit", function handleSubmit(ev) {
    ev.preventDefault();
    var titleInput = document.getElementById("title");
    var descInput = document.querySelector("#description");
    var moodInput = document.getElementById("mood");

    var payload = {
      title: titleInput.value,
      description: descInput.value,
      mood: moodInput.value
    };

    // Slightly inconsistent fetch style vs fetchTrips
    fetch(apiBaseUrl + "/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.json().then((e) => {
            throw new Error(e.error || "Failed to save trip");
          });
        }
        return resp.json();
      })
      .then(function () {
        titleInput.value = "";
        descInput.value = "";
        loadTripsAndRender();
      })
      .catch(function (err) {
        console.error(err);
        alert("Could not save trip: " + err.message);
      });
  });
}

function setupRefreshButton() {
  const btn = document.getElementById("refresh-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    loadTripsAndRender();
  });
}

function wireRandomButton() {
  const randomButton = document.querySelector("#random-btn");
  if (!randomButton) return;

  randomButton.onclick = function () {
    getRandomTrip()
      .then(function (trip) {
        // quick way: temporarily render just this one item
        TripUI.render({ items: [trip] });
      })
      .catch(function (err) {
        console.warn(err);
        alert("No trips to surprise you with yet.");
      });
  };
}

document.addEventListener("DOMContentLoaded", function onDomReady() {
  setupFormHandlers();
  setupRefreshButton();
  wireRandomButton();
  loadTripsAndRender();
});


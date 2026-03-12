"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");

// Data lives in a separate module here, unlike in other demos
const dataStore = require("./src/dataStore");
const attachChat = require("./src/chatSocket");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static front-end
app.use(express.static(path.join(__dirname, "public")));

// Slightly random extra route folder for API
const tripsRouter = require("./src/tripsRoute");
app.use("/api", tripsRouter);

// Another route defined directly here, for inconsistency
app.get("/healthcheck", function (req, res) {
  res.json({ ok: true, status: "green", time: new Date().toISOString() });
});

app.get("/stats", (req, res) => {
  res.json({ tripCount: dataStore.count(), version: "1.0" });
});

// Very simple "about" page using a separate folder
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Chat page (iMessage-ish UI)
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "chat.html"));
});

const server = http.createServer(app);

// Real-time chat transport
const { Server } = require("socket.io");
const io = new Server(server);
attachChat(io);

server.listen(PORT, () => {
  console.log(`WanderLog running on http://localhost:${PORT}`);
});


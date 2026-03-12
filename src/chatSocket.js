const chatStore = require("./chatStore");

function makeId() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function sanitizeText(v) {
  return String(v || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

function sanitizeName(v) {
  const s = String(v || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 36);
  return s || "You";
}

function attachChat(io) {
  io.on("connection", (socket) => {
    let displayName = "You";

    socket.emit("chat:init", { items: chatStore.loadMessages().slice(-80) });

    socket.on("chat:profile", (payload) => {
      displayName = sanitizeName(payload && payload.displayName);
      socket.emit("chat:profile:ok", { displayName });
    });

    socket.on("chat:typing", (payload) => {
      const typing = Boolean(payload && payload.typing);
      socket.broadcast.emit("chat:typing", { from: displayName, typing });
    });

    socket.on("chat:message", (payload) => {
      const text = sanitizeText(payload && payload.text);
      if (!text) return;

      const msg = {
        id: makeId(),
        text,
        from: displayName,
        createdAt: new Date().toISOString()
      };

      chatStore.addMessage(msg);
      io.emit("chat:message", msg);
    });
  });
}

module.exports = attachChat;


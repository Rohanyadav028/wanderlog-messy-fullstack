/* global io */

const socket = io();

let myName = "You";
let lastTypingSentAt = 0;
let typingTimer = null;

function $(id) {
  return document.getElementById(id);
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
}

function escapeText(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMessage(msg) {
  const list = $("chat-list");
  if (!list) return;

  const mine = (msg.from || "") === myName;

  const row = document.createElement("div");
  row.className = "chat-row " + (mine ? "chat-row--me" : "chat-row--them");

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble " + (mine ? "chat-bubble--me" : "chat-bubble--them");

  const text = document.createElement("div");
  text.className = "chat-text";
  text.innerHTML = escapeText(msg.text);

  const meta = document.createElement("div");
  meta.className = "chat-meta";
  meta.textContent = (mine ? "Delivered" : msg.from || "Someone") + " · " + formatTime(msg.createdAt);

  bubble.appendChild(text);
  bubble.appendChild(meta);
  row.appendChild(bubble);
  list.appendChild(row);

  list.scrollTop = list.scrollHeight;
}

function setStatus(text) {
  const el = $("chat-subtitle");
  if (el) el.textContent = text;
}

function showTyping(from) {
  const el = $("typing-indicator");
  if (!el) return;
  if (!from) {
    el.textContent = "";
    return;
  }
  el.textContent = from + " is typing…";
}

function sendTyping(typing) {
  const now = Date.now();
  if (typing && now - lastTypingSentAt < 650) return;
  lastTypingSentAt = now;
  socket.emit("chat:typing", { typing });
}

socket.on("connect", () => setStatus("Connected"));
socket.on("disconnect", () => setStatus("Disconnected"));

socket.on("chat:init", (payload) => {
  const items = payload && Array.isArray(payload.items) ? payload.items : [];
  $("chat-list").innerHTML = "";
  items.forEach(renderMessage);
});

socket.on("chat:message", (msg) => {
  renderMessage(msg);
});

socket.on("chat:typing", (payload) => {
  const from = payload && payload.typing ? payload.from : "";
  showTyping(from && from !== myName ? from : "");

  if (typingTimer) clearTimeout(typingTimer);
  if (from) {
    typingTimer = setTimeout(() => showTyping(""), 1200);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = $("chat-form");
  const input = $("chat-input");
  const profileForm = $("profile-form");
  const nameInput = $("displayName");

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      myName = (nameInput.value || "").trim().slice(0, 36) || "You";
      socket.emit("chat:profile", { displayName: myName });
      setStatus("Connected as " + myName);
    });
  }

  if (input) {
    input.addEventListener("input", () => {
      sendTyping(Boolean(input.value));
      if (!input.value) sendTyping(false);
    });
    input.addEventListener("blur", () => sendTyping(false));
  }

  if (!form || !input) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (input.value || "").trim();
    if (!text) return;

    socket.emit("chat:message", { text });
    input.value = "";
    sendTyping(false);
  });
});


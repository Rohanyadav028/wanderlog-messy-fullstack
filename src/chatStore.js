const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", ".data");
const CHAT_FILE = path.join(DATA_DIR, "chatMessages.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function safeReadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function safeWriteJson(filePath, value) {
  try {
    ensureDir();
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
    return true;
  } catch (e) {
    return false;
  }
}

function loadMessages() {
  const data = safeReadJson(CHAT_FILE, { items: [] });
  const items = Array.isArray(data.items) ? data.items : [];
  return items;
}

function saveMessages(items) {
  return safeWriteJson(CHAT_FILE, { items });
}

function addMessage(msg) {
  const all = loadMessages();
  all.push(msg);

  const trimmed = all.slice(-250);
  saveMessages(trimmed);
  return trimmed;
}

module.exports = {
  loadMessages,
  addMessage
};


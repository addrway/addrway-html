// ===============================
// ADDRWAY CORE (DEMO + UI HELPERS)
// ===============================

const DB_KEY = "addrway_demo_db";

// ---------- SEED DATABASE ----------
function seedDB() {
  const existing = localStorage.getItem(DB_KEY);
  if (existing) return JSON.parse(existing);

  const db = {
    users: [
      {
        id: "admin-1",
        name: "Luis",
        email: "admin@addrway.com",
        role: "admin",
        plan: "Business",
        status: "Active",
        lookupsUsed: 18942,
        createdAt: "2026-04-01T10:00:00Z"
      },
      {
        id: "u-101",
        name: "Sarah Johnson",
        email: "sarah@northship.com",
        role: "customer",
        plan: "Pro",
        status: "Active",
        lookupsUsed: 5122,
        createdAt: "2026-04-06T11:00:00Z"
      },
      {
        id: "u-102",
        name: "Marcus Lee",
        email: "marcus@atlasops.io",
        role: "customer",
        plan: "Free",
        status: "Near Limit",
        lookupsUsed: 824,
        createdAt: "2026-04-08T14:20:00Z"
      }
    ],

    lookups: [
      {
        id: "l-1",
        userId: "u-101",
        address: "1258 Maple Ave, Tampa, FL 33602",
        result: "Valid",
        cached: false,
        createdAt: "2026-04-19T19:02:00Z"
      },
      {
        id: "l-2",
        userId: "u-102",
        address: "890 Harbor Dr, Miami, FL 33101",
        result: "Review",
        cached: false,
        createdAt: "2026-04-19T19:10:00Z"
      }
    ]
  };

  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

// ---------- DB HELPERS ----------
function getDB() {
  return JSON.parse(localStorage.getItem(DB_KEY) || JSON.stringify(seedDB()));
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ---------- FORMAT ----------
function formatTime(value) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

// ---------- BADGE COLORS ----------
function badgeClass(status) {
  const v = String(status || "").toLowerCase();

  if (["active", "valid", "business", "pro"].includes(v)) return "badge-good";
  if (["near limit", "review", "warning"].includes(v)) return "badge-warn";
  if (["invalid", "failed"].includes(v)) return "badge-bad";

  return "badge-neutral";
}

// ---------- USER LOOKUP ----------
function userNameById(id) {
  const user = getDB().users.find(u => u.id === id);
  return user ? user.name : "Unknown";
}

// ---------- CREATE LOOKUP ----------
function createLookup(address, userId) {
  const db = getDB();

  const cached = db.lookups.some(
    l => l.address.toLowerCase() === address.toLowerCase()
  );

  let result = "Valid";
  if (address.length < 10) result = "Review";
  if (address.toLowerCase().includes("invalid")) result = "Invalid";

  const lookup = {
    id: "l-" + Date.now(),
    userId,
    address,
    result,
    cached,
    createdAt: new Date().toISOString()
  };

  db.lookups.unshift(lookup);

  const user = db.users.find(u => u.id === userId);
  if (user) user.lookupsUsed += 1;

  saveDB(db);
  return lookup;
}

// ---------- NAVIGATION ----------
function navHTML(active) {
  return [
    ["admin.html", "Dashboard"],
    ["admin-users.html", "Users"],
    ["admin-lookups.html", "Lookups"],
    ["analytics.html", "Analytics"],
    ["billing.html", "Billing"]
  ]
    .map(([href, label]) =>
      `<a href="${href}" class="${active === label ? "active" : ""}">${label}</a>`
    )
    .join("");
}

function customerNavHTML(active) {
  return [
    ["customer-dashboard.html", "Dashboard"],
    ["lookup.html", "Lookup"],
    ["history.html", "History"]
  ]
    .map(([href, label]) =>
      `<a href="${href}" class="${active === label ? "active" : ""}">${label}</a>`
    )
    .join("");
}

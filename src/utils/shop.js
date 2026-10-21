/**
 * Menu/cart calculations, guarded versioned storage, and Toronto-aware demo form validation.
 */
import { menu } from "../data/menu.js";
export const money = (value) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    value,
  );

// ========================================
// MENU FILTERING
// ========================================
export function filterMenu(items, query = "", category = "All", diets = []) {
  return items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      diets.every((d) => item.dietary.includes(d)) &&
      `${item.name} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
}

// ========================================
// CART VALIDATION AND TOTALS
// ========================================
export function cleanCart(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .filter(
      (row) =>
        row &&
        menu.some((i) => i.id === row.id && i.available) &&
        Number.isInteger(row.quantity) &&
        row.quantity > 0 &&
        row.quantity <= 20 &&
        !seen.has(row.id) &&
        seen.add(row.id),
    )
    .map(({ id, quantity }) => ({ id, quantity }));
}
export function totals(cart, delivery = false) {
  const subtotal = cart.reduce(
    (sum, row) =>
      sum + (menu.find((i) => i.id === row.id)?.price || 0) * row.quantity,
    0,
  );
  const fee = delivery && subtotal > 0 ? 5 : 0;
  const tax = Math.round((subtotal + fee) * 13) / 100;
  return {
    subtotal,
    fee,
    tax,
    total: Math.round((subtotal + fee + tax) * 100) / 100,
  };
}

// ========================================
// LOCAL STORAGE
// ========================================
export function readStorage(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data?.version === 1 ? data.value : fallback;
  } catch {
    return fallback;
  }
}
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ version: 1, value }));
    return true;
  } catch {
    return false;
  }
}

// ========================================
// DATES AND FORM VALIDATION
// ========================================
export function torontoToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function reservationErrors(
  data,
  today = torontoToday(),
  currentTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date()),
) {
  const errors = {};
  if (!data.name?.trim() || data.name.trim().length < 2)
    errors.name = "Enter a name with at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ""))
    errors.email = "Enter a valid email address.";
  const parsed = new Date(`${data.date}T12:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date || "") ||
    Number.isNaN(+parsed) ||
    parsed.toISOString().slice(0, 10) !== data.date ||
    data.date < today
  )
    errors.date = "Choose today or a future date in Toronto.";
  if (
    ![
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ].includes(data.time)
  )
    errors.time = "Choose an available dinner time.";
  else if (data.date === today && data.time <= currentTime)
    errors.time =
      "Choose a dinner time that is still in the future in Toronto.";
  if (
    !Number.isInteger(Number(data.guests)) ||
    Number(data.guests) < 1 ||
    Number(data.guests) > 8
  )
    errors.guests = "Choose between 1 and 8 guests.";
  return errors;
}
export function checkoutErrors(data, delivery) {
  const errors = {};
  if (!data.name?.trim() || data.name.trim().length < 2)
    errors.name = "Enter a name with at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ""))
    errors.email = "Enter a valid email address.";
  if (delivery && !data.address?.trim())
    errors.address = "Enter a demo delivery address.";
  if (delivery && !/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i.test(data.postal || ""))
    errors.postal = "Enter a Canadian postal code, for example M5V 2T6.";
  return errors;
}

/**
 * Node test coverage for sample data, combined filters, cart totals, Toronto dates, validation, and storage recovery.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { menu } from "../src/data/menu.js";
import {
  filterMenu,
  cleanCart,
  totals,
  reservationErrors,
  checkoutErrors,
  readStorage,
  writeStorage,
  torontoToday,
} from "../src/utils/shop.js";

// ========================================
// MENU DATA AND FILTERING
// ========================================
test("24 complete menu records with unique ids and positive CAD prices", () => {
  assert.equal(menu.length, 24);
  assert.equal(new Set(menu.map((i) => i.id)).size, 24);
  for (const item of menu) {
    assert.ok(item.image.startsWith("/images/"));
    assert.ok(item.price > 0);
    assert.equal(typeof item.available, "boolean");
    assert.ok(Array.isArray(item.dietary));
  }
});
test("search, category and multiple dietary filters combine", () => {
  assert.deepEqual(
    filterMenu(menu, "  cauliflower ", "Mains", ["Vegan", "Gluten-free"]).map(
      (i) => i.id,
    ),
    ["cauliflower"],
  );
  assert.equal(filterMenu(menu, "ribeye", "Desserts", []).length, 0);
  assert.ok(
    filterMenu(menu, "", "All", ["Vegan"]).every((i) =>
      i.dietary.includes("Vegan"),
    ),
  );
});

// ========================================
// CART VALIDATION AND TOTALS
// ========================================
test("cart rejects invalid, duplicated and unavailable records", () => {
  assert.deepEqual(
    cleanCart([
      { id: "ribeye", quantity: 2 },
      { id: "ribeye", quantity: 3 },
      { id: "tart", quantity: 1 },
      { id: "unknown", quantity: 1 },
      { id: "soup", quantity: 21 },
      { id: "bread", quantity: 0 },
      null,
    ]),
    [{ id: "ribeye", quantity: 2 }],
  );
  assert.deepEqual(cleanCart({}), []);
});
test("pickup and delivery totals include quantity and rounded sample HST", () => {
  assert.deepEqual(totals([{ id: "ribeye", quantity: 2 }]), {
    subtotal: 96,
    fee: 0,
    tax: 12.48,
    total: 108.48,
  });
  assert.deepEqual(totals([{ id: "ribeye", quantity: 2 }], true), {
    subtotal: 96,
    fee: 5,
    tax: 13.13,
    total: 114.13,
  });
  assert.equal(totals([], true).total, 0);
});

// ========================================
// RESERVATION VALIDATION
// ========================================
test("reservation rejects missing fields, past and impossible dates", () => {
  assert.equal(Object.keys(reservationErrors({}, "2026-10-20")).length, 5);
  const valid = {
    name: "Alex Guest",
    email: "alex@example.com",
    date: "2026-10-21",
    time: "18:00",
    guests: "2",
  };
  assert.deepEqual(reservationErrors(valid, "2026-10-20"), {});
  for (const date of ["2026-10-19", "2026-02-30", "not-a-date"])
    assert.ok(reservationErrors({ ...valid, date }, "2026-10-20").date);
  assert.ok(
    reservationErrors({ ...valid, guests: "2.5" }, "2026-10-20").guests,
  );
});
test("Toronto day respects timezone near UTC midnight", () => {
  assert.equal(torontoToday(new Date("2026-10-21T01:00:00Z")), "2026-10-20");
});
test("same-day reservations reject elapsed Toronto dinner times", () => {
  const data = {
    name: "Alex",
    email: "alex@example.com",
    date: "2026-10-20",
    time: "18:00",
    guests: 2,
  };
  assert.ok(reservationErrors(data, "2026-10-20", "19:00").time);
  assert.deepEqual(
    reservationErrors({ ...data, time: "20:00" }, "2026-10-20", "19:00"),
    {},
  );
});

// ========================================
// CHECKOUT AND STORAGE VALIDATION
// ========================================
test("checkout validates names, emails and delivery details", () => {
  assert.deepEqual(
    checkoutErrors({ name: "Alex", email: "alex@example.com" }, false),
    {},
  );
  assert.equal(Object.keys(checkoutErrors({}, true)).length, 4);
  assert.deepEqual(
    checkoutErrors(
      {
        name: "Alex",
        email: "alex@example.com",
        address: "123 Demo St",
        postal: "M5V 2T6",
      },
      true,
    ),
    {},
  );
});
test("versioned storage round trip, corrupt data and unavailable storage", () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (k) => values.get(k) || null,
    setItem: (k, v) => values.set(k, v),
  };
  assert.ok(writeStorage("cart", [{ id: "ribeye", quantity: 2 }]));
  assert.deepEqual(cleanCart(readStorage("cart", [])), [
    { id: "ribeye", quantity: 2 },
  ]);
  values.set("cart", "broken");
  assert.deepEqual(readStorage("cart", []), []);
  values.set("cart", JSON.stringify({ version: 99, value: [1] }));
  assert.deepEqual(readStorage("cart", []), []);
  globalThis.localStorage = {
    getItem: () => {
      throw Error("blocked");
    },
    setItem: () => {
      throw Error("blocked");
    },
  };
  assert.equal(writeStorage("x", []), false);
  assert.deepEqual(readStorage("x", []), []);
  delete globalThis.localStorage;
});

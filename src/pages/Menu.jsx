/**
 * Shared menu and ordering page with combined search, category/dietary filters, and cart actions.
 */
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { menu, categories } from "../data/menu.js";
import { filterMenu } from "../utils/shop.js";
import { DishCard, Heading } from "../components/UI.jsx";

export default function Menu({ add, ordering = false }) {
  // ========================================
  // MENU FILTERING
  // ========================================
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [diets, setDiets] = useState([]);
  const items = filterMenu(menu, query, category, diets);
  function reset() {
    setQuery("");
    setCategory("All");
    setDiets([]);
  }

  return (
    <div className="wrap">
      <Heading
        eyebrow={
          ordering
            ? "A GOOD MEAL, YOUR WAY"
            : "SEASONALLY INSPIRED · THOUGHTFULLY PREPARED"
        }
        title={
          ordering
            ? "Your next favourite meal."
            : "Good food. No small details."
        }
      >
        {ordering
          ? "Build a demo order for pickup or delivery. No food will be prepared and no payment is taken."
          : "From the first bite to the last little indulgence. Explore our fictional seasonal menu, priced in Canadian dollars."}
      </Heading>
      {/* ========================================
          SEARCH AND FILTER CONTROLS
          ======================================== */}
      <div className="menu-tools">
        <label className="search">
          <Search size={19} />
          <span className="sr-only">Search the menu</span>
          <input
            type="search"
            placeholder="Find your next favourite…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <span className="menu-currency">CAD · HST calculated at checkout</span>
      </div>
      <div className="category-tabs" aria-label="Menu categories">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="diet-filters">
        <SlidersHorizontal size={17} />
        <span>Dietary preferences</span>
        {["Vegetarian", "Vegan", "Gluten-free"].map((d) => (
          <label key={d}>
            <input
              type="checkbox"
              checked={diets.includes(d)}
              onChange={(e) =>
                setDiets(
                  e.target.checked
                    ? [...diets, d]
                    : diets.filter((x) => x !== d),
                )
              }
            />
            {d}
          </label>
        ))}
        <button className="text-link" onClick={reset}>
          Reset filters
        </button>
      </div>
      {/* ========================================
          MENU RESULTS AND EMPTY STATE
          ======================================== */}
      <div className="results-line">
        <p role="status">
          {items.length} {items.length === 1 ? "dish" : "dishes"} to discover
        </p>
        <p>Dietary labels are illustrative. Allergens are not verified.</p>
      </div>
      {items.length ? (
        <div className="grid dishes">
          {items.map((item) => (
            <DishCard key={item.id} item={item} add={add} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No dishes match just yet.</h2>
          <p>Try another search or loosen your dietary preferences.</p>
          <button className="button" onClick={reset}>
            Clear all filters
          </button>
        </div>
      )}
      <p className="caption">
        Photographs are illustrative and may differ from dish descriptions. All
        items and availability are sample data.
      </p>
    </div>
  );
}

/**
 * Renders shared order totals, cart controls, and simulated pickup/delivery checkout without payments.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { menu } from "../data/menu.js";
import { money, totals, checkoutErrors } from "../utils/shop.js";
import {
  Heading,
  Photo,
  ButtonLink,
  Empty,
  DemoNote,
  Field,
} from "../components/UI.jsx";

// ========================================
// ORDER SUMMARY
// ========================================
export function Summary({ cart, delivery = false }) {
  const t = totals(cart, delivery);
  return (
    <div className="summary">
      <h2>Your order</h2>
      {cart.map((row) => (
        <div className="summary-item" key={row.id}>
          <span>
            {row.quantity} × {menu.find((i) => i.id === row.id).name}
          </span>
          <span>
            {money(menu.find((i) => i.id === row.id).price * row.quantity)}
          </span>
        </div>
      ))}
      <dl className="receipt">
        <dt>Subtotal</dt>
        <dd>{money(t.subtotal)}</dd>
        <dt>Delivery</dt>
        <dd>{delivery ? money(t.fee) : "Pickup · Free"}</dd>
        <dt>Demo HST (13%)</dt>
        <dd>{money(t.tax)}</dd>
        <dt className="total">Total CAD</dt>
        <dd className="total">{money(t.total)}</dd>
      </dl>
      <DemoNote />
    </div>
  );
}

// ========================================
// CART MANAGEMENT
// ========================================
export function Cart({ cart, update }) {
  return (
    <div className="wrap">
      <Heading
        eyebrow="SOMETHING TO LOOK FORWARD TO"
        title="Your table, to go."
      >
        Your selection is saved on this browser. Prices are in CAD; checkout is
        a simulation.
      </Heading>
      {!cart.length ? (
        <Empty title="Your cart is waiting for something good.">
          Explore the menu and add a dish to begin.
        </Empty>
      ) : (
        <div className="shop-layout">
          <div>
            {cart.map((row) => {
              const item = menu.find((i) => i.id === row.id);
              return (
                <article className="cart-row" key={row.id}>
                  <Photo src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{money(item.price)} each</p>
                    <div className="quantity">
                      <button
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={row.quantity === 1}
                        onClick={() => update(row.id, row.quantity - 1)}
                      >
                        <Minus size={15} />
                      </button>
                      <span aria-label={`Quantity ${row.quantity}`}>
                        {row.quantity}
                      </span>
                      <button
                        aria-label={`Increase ${item.name} quantity`}
                        disabled={row.quantity === 20}
                        onClick={() => update(row.id, row.quantity + 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-end">
                    <strong>{money(item.price * row.quantity)}</strong>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => update(row.id, 0)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              );
            })}
            <Link className="text-link" to="/order">
              Continue exploring the menu
            </Link>
          </div>
          <div>
            <Summary cart={cart} />
            <ButtonLink to="/checkout">Continue to demo checkout</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

export function Checkout({ cart, clear }) {
  // ========================================
  // CHECKOUT STATE
  // ========================================
  const [delivery, setDelivery] = useState(false);
  const [errors, setErrors] = useState({});
  const [receipt, setReceipt] = useState(null);

  // ========================================
  // CHECKOUT SUBMISSION
  // ========================================
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const invalid = checkoutErrors(data, delivery);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() =>
        document.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    setReceipt({
      cart: cart.map((x) => ({ ...x })),
      delivery,
      id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    });
    clear();
  }

  // ========================================
  // SIMULATED ORDER RECEIPT
  // ========================================
  if (receipt)
    return (
      <div className="wrap">
        <Heading
          eyebrow="DEMO CHECKOUT COMPLETE"
          title="A little taste of the experience."
        >
          No order was sent, no payment was taken and no food will be prepared.
        </Heading>
        <p>
          Demo reference: {receipt.id} ·{" "}
          {receipt.delivery ? "Delivery" : "Pickup"} simulation
        </p>
        <div className="reading">
          <Summary cart={receipt.cart} delivery={receipt.delivery} />
        </div>
        <ButtonLink to="/menu">Explore more dishes</ButtonLink>
      </div>
    );

  // ========================================
  // CHECKOUT FORM
  // ========================================
  return (
    <div className="wrap">
      <Heading eyebrow="THE FINAL DETAILS" title="Bring the kitchen home.">
        Try the pickup or delivery experience. Use sample details; they will not
        be stored or transmitted.
      </Heading>
      {!cart.length ? (
        <Empty title="A delicious first step awaits.">
          Add a dish before trying demo checkout.
        </Empty>
      ) : (
        <div className="shop-layout">
          <form className="form-panel" onSubmit={submit} noValidate>
            <fieldset className="fulfilment">
              <legend>How would you like your demo order?</legend>
              <label>
                <input
                  type="radio"
                  name="fulfilment"
                  checked={!delivery}
                  onChange={() => setDelivery(false)}
                />{" "}
                Pickup · Free
              </label>
              <label>
                <input
                  type="radio"
                  name="fulfilment"
                  checked={delivery}
                  onChange={() => setDelivery(true)}
                />{" "}
                Delivery · $5.00
              </label>
            </fieldset>
            <p className="demo-note">
              {delivery
                ? "Illustrative Toronto delivery. No courier will be dispatched."
                : "Illustrative pickup only. No collection time or location is assigned."}
            </p>
            <div className="form-grid">
              <Field
                name="name"
                label="Sample name"
                placeholder="Alex Guest"
                required
                error={errors.name}
              />
              <Field
                name="email"
                type="email"
                label="Sample email"
                placeholder="alex@example.com"
                required
                error={errors.email}
              />
              {delivery && (
                <>
                  <Field
                    name="address"
                    label="Sample address"
                    placeholder="123 Demo Street, Toronto"
                    required
                    error={errors.address}
                  />
                  <Field
                    name="postal"
                    label="Sample postal code"
                    placeholder="M5V 2T6"
                    required
                    error={errors.postal}
                  />
                </>
              )}
            </div>
            <div className="aside-note">
              <h3>No payment details needed</h3>
              <p>
                This demo has no payment gateway. Please never enter credit card
                or banking information.
              </p>
            </div>
            <button className="button" type="submit">
              Complete demo checkout
            </button>
          </form>
          <Summary cart={cart} delivery={delivery} />
        </div>
      )}
    </div>
  );
}

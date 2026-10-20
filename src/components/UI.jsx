import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { money } from "../utils/shop.js";
export function Photo({ src, alt, className = "", eager = false, ...props }) {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/images/fallback.svg";
      }}
    />
  );
}
export function ButtonLink({ to, children, secondary = false }) {
  return (
    <Link className={`button ${secondary ? "secondary" : ""}`} to={to}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Heading({ eyebrow, title, children }) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="intro">{children}</p>}
    </header>
  );
}
export function DishCard({ item, add }) {
  return (
    <article className="dish-card">
      <div className="dish-photo">
        <Photo
          src={item.image}
          alt={`Illustrative ${item.category.toLowerCase()} photography for ${item.name}`}
        />
        <span className="dish-category">{item.category}</span>
      </div>
      <div className="dish-body">
        <div className="dish-title">
          <h3>{item.name}</h3>
          <span>{money(item.price)}</span>
        </div>
        <p>{item.description}</p>
        <div className="dish-bottom">
          <span className="diet-label">
            {item.dietary.join(" · ") || "Chef’s selection"}
          </span>
          <button
            className="add-button"
            disabled={!item.available}
            onClick={() => add(item.id)}
            aria-label={
              item.available
                ? `Add ${item.name} to cart`
                : `${item.name} is unavailable`
            }
          >
            {item.available ? <Plus size={19} /> : <span>Unavailable</span>}
          </button>
        </div>
      </div>
    </article>
  );
}
export function Field({ label, name, error, children, ...props }) {
  const id = `field-${name}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children ? (
        <select
          id={id}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}{" "}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
export function DemoNote() {
  return (
    <p className="demo-note">
      Portfolio demo · No real orders, payments or restaurant submissions.
      Please use sample details.
    </p>
  );
}
export function Empty({ title, children }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{children}</p>
      <ButtonLink to="/menu">Explore the menu</ButtonLink>
    </div>
  );
}

/**
 * Illustrative photo gallery with a native modal, keyboard navigation, and restored trigger focus.
 */
import { useEffect, useRef, useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Heading, Photo } from "../components/UI.jsx";
import { photos } from "../data/menu.js";

// ========================================
// GALLERY CONTENT
// ========================================
export const gallery = [
  {
    src: photos.room,
    alt: "A warm, plant-filled dining room",
    label: "A space to settle in",
  },
  {
    src: photos.steak,
    alt: "A carefully prepared steak dish",
    label: "Comfort, from the kitchen",
  },
  {
    src: photos.dining,
    alt: "Elegant plates on a restaurant table",
    label: "The details make the evening",
  },
  {
    src: photos.salad,
    alt: "A vibrant bowl of seasonal vegetables",
    label: "Led by the season",
  },
  {
    src: photos.pasta,
    alt: "Pasta with fresh green herbs",
    label: "Something worth sharing",
  },
  {
    src: photos.dessert,
    alt: "Dessert with fruit and cream",
    label: "Always a sweet finish",
  },
];

export default function Gallery() {
  // ========================================
  // LIGHTBOX STATE
  // ========================================
  const [active, setActive] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);

  // ========================================
  // DIALOG FOCUS LIFECYCLE
  // ========================================
  useEffect(() => {
    if (active === null) return;
    const el = dialog.current;
    el.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.querySelector("button")?.focus();
    return () => {
      el.close();
      document.body.style.overflow = previous;
      trigger.current?.focus();
    };
  }, [active !== null]);

  // ========================================
  // LIGHTBOX EVENT HANDLERS
  // ========================================
  function close() {
    setActive(null);
  }
  function keys(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % gallery.length);
    if (e.key === "ArrowLeft")
      setActive((i) => (i + gallery.length - 1) % gallery.length);
    if (e.key === "Tab") {
      const buttons = [...dialog.current.querySelectorAll("button")];
      if (e.shiftKey && document.activeElement === buttons[0]) {
        e.preventDefault();
        buttons.at(-1).focus();
      } else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
        e.preventDefault();
        buttons[0].focus();
      }
    }
  }

  return (
    <div className="wrap">
      <Heading
        eyebrow="A GLIMPSE OF THE GOOD LIFE"
        title="The mood. The food. The moments."
      >
        An illustrative collection of the atmosphere and seasonal cooking that
        inspire our fictional kitchen.
      </Heading>
      {/* ========================================
          GALLERY GRID
          ======================================== */}
      <div className="gallery-grid">
        {gallery.map((p, i) => (
          <button
            className="gallery-tile"
            key={p.src}
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setActive(i);
            }}
            aria-label={`Open photograph: ${p.label}`}
          >
            <Photo src={p.src} alt={p.alt} />
            <span>
              {p.label}
              <ArrowRight size={19} />
            </span>
          </button>
        ))}
      </div>
      <p className="caption">
        Illustrative photography from Unsplash. These images do not depict an
        actual Ember & Oak restaurant.
      </p>
      {/* ========================================
          ACCESSIBLE LIGHTBOX
          ======================================== */}
      {active !== null && (
        <dialog
          ref={dialog}
          className="lightbox"
          aria-label="Photo gallery"
          onKeyDown={keys}
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="lightbox-inner">
            <button
              className="lightbox-close icon-button"
              onClick={close}
              aria-label="Close gallery"
            >
              <X />
            </button>
            <Photo src={gallery[active].src} alt={gallery[active].alt} eager />
            <div className="lightbox-controls">
              <button
                className="icon-button"
                aria-label="Previous photograph"
                onClick={() =>
                  setActive((i) => (i + gallery.length - 1) % gallery.length)
                }
              >
                <ArrowLeft />
              </button>
              <p aria-live="polite">
                {gallery[active].label} · {active + 1} / {gallery.length}
              </p>
              <button
                className="icon-button"
                aria-label="Next photograph"
                onClick={() => setActive((i) => (i + 1) % gallery.length)}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

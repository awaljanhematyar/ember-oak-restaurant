import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Heading, Field, DemoNote, ButtonLink } from "../components/UI.jsx";
import {
  reservationErrors,
  torontoToday,
  writeStorage,
} from "../utils/shop.js";
export default function Reservations() {
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const invalid = reservationErrors(data);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() =>
        document.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    const request = {
      date: data.date,
      time: data.time,
      guests: Number(data.guests),
      id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    };
    const saved = writeStorage("eo-reservation-v1", request);
    setResult({ ...request, saved });
  }
  return (
    <div className="wrap">
      <Heading
        eyebrow="MAKE TIME FOR SOMETHING GOOD"
        title="There’s a place for you here."
      >
        An evening for two. A gathering of friends. Try our reservation request
        experience.
      </Heading>
      <div className="form-layout">
        <aside className="form-aside">
          <h2>
            Your evening,
            <br />
            <em>thoughtfully planned.</em>
          </h2>
          <p>
            Our fictional dining room opens for dinner daily. Choose a date,
            time and party size to try the demo.
          </p>
          <p>
            <Clock size={18} /> Dinner · 5:00 pm – 10:00 pm
          </p>
          <p>
            <MapPin size={18} /> Toronto, Ontario · Fictional location
          </p>
          <div className="aside-note">
            <h3>A note before you book</h3>
            <p>
              This is a simulation. No table is held and no request reaches a
              restaurant. Use sample details; your name and email are not saved.
              Only the date, time, party size and demo reference are stored on
              this browser.
            </p>
          </div>
        </aside>
        {result ? (
          <div className="form-panel" role="status">
            <p className="eyebrow">SIMULATION COMPLETE</p>
            <h2>{result.saved ? 'Demo request saved locally.' : 'Demo request completed.'}</h2>
            <p>No booking has been made or confirmed.</p>
            <dl className="receipt">
              <dt>Demo reference</dt>
              <dd>{result.id}</dd>
              <dt>Date</dt>
              <dd>{result.date}</dd>
              <dt>Dinner time</dt>
              <dd>{result.time} · Toronto</dd>
              <dt>Party size</dt>
              <dd>{result.guests}</dd>
            </dl>
            {!result.saved && (
              <p>
                Browser storage is unavailable. This request will disappear when
                you leave.
              </p>
            )}
            <button className="button" onClick={() => setResult(null)}>
              Try another request
            </button>
          </div>
        ) : (
          <form className="form-panel" onSubmit={submit} noValidate>
            <h2>Request a table</h2>
            <DemoNote />
            <div className="form-grid">
              <Field
                label="Sample name"
                name="name"
                autoComplete="off"
                placeholder="Alex Guest"
                required
                error={errors.name}
              />
              <Field
                label="Sample email"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="alex@example.com"
                required
                error={errors.email}
              />
              <Field
                label="Date (Toronto)"
                name="date"
                type="date"
                min={torontoToday()}
                required
                error={errors.date}
              />
              <Field
                label="Dinner time"
                name="time"
                defaultValue=""
                required
                error={errors.time}
              >
                <option value="" disabled>
                  Select a time
                </option>
                {[
                  "17:00",
                  "17:30",
                  "18:00",
                  "18:30",
                  "19:00",
                  "19:30",
                  "20:00",
                  "20:30",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Field>
              <Field
                label="Guests"
                name="guests"
                defaultValue="2"
                error={errors.guests}
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} {i ? "guests" : "guest"}
                  </option>
                ))}
              </Field>
            </div>
            <p className="caption">
              For same-day requests, choose a future dinner time. Demo
              availability is illustrative.
            </p>
            <button className="button" type="submit">
              Save demo request
            </button>
          </form>
        )}
      </div>
      <div className="section">
        <ButtonLink to="/menu">See what’s cooking</ButtonLink>
      </div>
    </div>
  );
}

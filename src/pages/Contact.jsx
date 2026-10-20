import { useState } from "react";
import { Heading, Field, DemoNote } from "../components/UI.jsx";
export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="wrap">
      <Heading
        eyebrow="LET’S START A CONVERSATION"
        title="Good things begin with hello."
      >
        Explore our contact experience. Ember & Oak is a fictional Toronto
        restaurant.
      </Heading>
      <div className="form-layout">
        <aside className="form-aside">
          <h2>A little local spirit.</h2>
          <p>Toronto, Ontario, Canada</p>
          <p>Fictional location · No public street address</p>
          <div className="aside-note">
            <h3>Illustrative dinner hours</h3>
            <p>
              Monday – Sunday
              <br />
              5:00 pm – 10:00 pm
              <br />
              All times in Toronto.
            </p>
          </div>
          <p>
            There is no working restaurant inbox or telephone number associated
            with this demo.
          </p>
        </aside>
        {sent ? (
          <div className="form-panel" role="status">
            <h2>Demo message completed.</h2>
            <p>
              Your message was not sent or stored. Thanks for exploring the
              experience.
            </p>
            <button className="button" onClick={() => setSent(false)}>
              Try again
            </button>
          </div>
        ) : (
          <form
            className="form-panel"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2>Say hello</h2>
            <DemoNote />
            <Field
              name="contact-name"
              label="Sample name"
              required
              minLength={2}
              maxLength={80}
            />
            <Field
              name="contact-email"
              label="Sample email"
              type="email"
              required
              maxLength={150}
            />
            <label className="message-label" htmlFor="message">
              Sample message
            </label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              placeholder="Tell us about your imaginary occasion…"
            />
            <button className="button" type="submit">
              Try demo submission
            </button>
          </form>
        )}
      </div>
      <section className="contact-map section" aria-labelledby="map-heading">
        <div className="section-heading"><div><p className="eyebrow">A LITTLE TORONTO SPIRIT</p><h2 id="map-heading">Our city. <em>Your inspiration.</em></h2></div><span className="map-badge">DEMO LOCATION</span></div>
        <p>This map shows Toronto, Ontario for illustration only. Ember & Oak Kitchen is fictional and has no physical restaurant at the map’s centre.</p>
        <div className="map-frame"><iframe title="Demo location map showing the city of Toronto, Ontario" src="https://maps.google.com/maps?q=Toronto%2C%20Ontario&z=12&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
        <p className="map-help">The interactive map is provided by Google. If it cannot load, use the link below to explore the demo city.</p>
        <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Toronto%2C%20Ontario" target="_blank" rel="noreferrer">Explore Toronto on Google Maps <span className="sr-only">(opens in a new tab)</span> ↗</a>
      </section>
    </div>
  );
}

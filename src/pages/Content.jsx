import { ArrowRight, Flame, Leaf, UtensilsCrossed, Clock3, MapPin, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { menu, photos } from "../data/menu.js";
import { ButtonLink, Heading, Photo, DishCard } from "../components/UI.jsx";
export function Home({ add }) {
  return (
    <>
      <section className="hero">
        <div className="hero-shell wrap">
        <div className="hero-content">
          <p className="eyebrow light">
            <span /> TORONTO SPIRIT. SEASONAL SOUL.
          </p>
          <h1>
            Exceptional Food.
            <br />
            <em>Unforgettable</em>
            <br />
            Moments.
          </h1>
          <p>
            A little warmth. A little wonder. Discover a Toronto-inspired dining
            experience, made to be shared.
          </p>
          <div className="button-row">
            <ButtonLink to="/order">Order Now</ButtonLink>
            <ButtonLink to="/menu" secondary>
              Explore Menu
            </ButtonLink>
          </div>
          <div className="hero-details">
            <div><Flame size={19}/><span>Seasonal cooking<small>Inspired by the fire</small></span></div>
            <div><Clock3 size={19}/><span>Dinner, unhurried<small>Daily · 5 pm – 10 pm</small></span></div>
            <div><MapPin size={19}/><span>Toronto, Ontario<small>A fictional local kitchen</small></span></div>
          </div>
        </div>
        <div className="hero-visual">
          <span className="orbit orbit-one" aria-hidden="true"/>
          <span className="orbit orbit-two" aria-hidden="true"/>
          <span className="garnish garnish-one" aria-hidden="true"/>
          <span className="garnish garnish-two" aria-hidden="true"/>
          <div className="hero-plate"><Photo src={photos.pasta} alt="A generous plate of fresh herb pasta with cherry tomatoes, illustrative of our seasonal kitchen" eager className="hero-image"/></div>
          <div className="plate-label"><Flame size={21}/><span>A little heat.<br/><strong>A lot of heart.</strong></span></div>
          <p className="hero-photo-caption">Seasonal inspiration · Illustrative photography</p>
        </div>
        </div>
        <span className="hero-side">THE ART OF GATHERING</span>
      </section>
      <section className="welcome section wrap">
        <p className="eyebrow">WELCOME TO EMBER & OAK</p>
        <div className="welcome-grid">
          <h2>
            Rooted in the season.
            <br />
            <em>Made for the moment.</em>
          </h2>
          <div>
            <p>
              We believe the best meals are about more than what’s on the plate.
              They’re the stories shared, the glasses raised, and the feeling of
              being right where you belong.
            </p>
            <Link className="text-link" to="/about">
              Get to know our kitchen <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section featured">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FROM OUR KITCHEN</p>
              <h2>
                A taste of <em>what we love.</em>
              </h2>
            </div>
            <Link className="text-link" to="/menu">
              View the full menu <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid dishes">
            {[menu[6], menu[9], menu[0]].map((item) => (
              <DishCard key={item.id} item={item} add={add} />
            ))}
          </div>
          <p className="caption">
            Seasonal sample menu · All prices in CAD · Food photography is
            illustrative.
          </p>
        </div>
      </section>
      <section className="story-strip wrap section">
        <Photo
          src={photos.room}
          alt="Warmly lit restaurant interior with plants and communal tables"
        />
        <div>
          <p className="eyebrow">A SEAT AT OUR TABLE</p>
          <h2>
            Come for dinner.
            <br />
            <em>Stay for the feeling.</em>
          </h2>
          <p>
            From an unhurried weeknight meal to the moments worth celebrating,
            there’s always room for a good gathering.
          </p>
          <ButtonLink to="/reservations">Plan your evening</ButtonLink>
        </div>
      </section>
      <section className="ordering-story wrap section">
        <div className="ordering-visual"><Photo src={photos.salad} alt="A vibrant bowl of fresh seasonal vegetables"/><span className="ordering-badge"><Leaf size={24}/> Fresh thinking.<br/>Full flavour.</span></div>
        <div><p className="eyebrow">YOUR FAVOURITES. YOUR EVENING.</p><h2>Good taste.<br/><em>Wherever you gather.</em></h2><p>Make a little room for something delicious. Explore the pickup and delivery experience, from your first favourite to the final detail.</p><div className="ordering-steps"><div><span>01</span><div><h3>Find your flavour</h3><p>Seasonal plates, comforting classics and something sweet.</p></div></div><div><span>02</span><div><h3>Make it your evening</h3><p>Try pickup or delivery in our clearly labelled demo checkout.</p></div></div></div><ButtonLink to="/order">Build your demo order</ButtonLink></div>
      </section>
      <section className="values wrap">
        <div>
          <Flame />
          <h3>Inspired by the fire</h3>
          <p>Bold flavours and the comfort of a thoughtfully cooked meal.</p>
        </div>
        <div>
          <Leaf />
          <h3>Led by the season</h3>
          <p>A sample menu celebrating fresh, familiar ingredients.</p>
        </div>
        <div>
          <UtensilsCrossed />
          <h3>Made to be shared</h3>
          <p>A welcoming table for everyday occasions and special moments.</p>
        </div>
      </section>
    </>
  );
}
export function About() {
  return (
    <>
      <div className="wrap">
        <Heading eyebrow="OUR STORY" title="A warm welcome. An open table.">
          A fictional kitchen with a very real love for food and the people it
          brings together.
        </Heading>
      </div>
      <section className="story-strip wrap">
        <Photo
          src={photos.room}
          alt="Illustrative dining room with warm wood finishes"
          eager
        />
        <div>
          <p className="eyebrow">THE SPIRIT OF EMBER & OAK</p>
          <h2>
            Simple ingredients.
            <br />
            <em>Considered details.</em>
          </h2>
          <p>
            Ember & Oak Kitchen imagines a neighbourhood restaurant in Toronto:
            a place where seasonal cooking meets easy hospitality. Our menu
            draws inspiration from Ontario produce, comforting classics and the
            warmth of cooking over fire.
          </p>
          <p>
            This concept was created as a frontend portfolio project. The
            restaurant, menu and services are fictional; photographs illustrate
            the mood rather than an actual location.
          </p>
          <ButtonLink to="/menu">Find your favourite</ButtonLink>
        </div>
      </section>
      <section className="wrap section">
        <h2>A little more about the menu</h2>
        <p className="reading">
          From plant-forward starters to hearty mains and a sweet finish, the
          sample menu makes room for different tastes. Dietary tags are
          illustrative and cannot guarantee allergen safety. A real restaurant
          would need to confirm ingredients and cross-contact procedures.
        </p>
      </section>
    </>
  );
}
export function NotFound() {
  return (
    <div className="wrap">
      <Heading
        eyebrow="404 · A LITTLE OFF THE MENU"
        title="This table doesn’t exist."
      >
        The page you’re looking for may have moved. Let’s get you back to
        something delicious.
      </Heading>
      <ButtonLink to="/">Back to the kitchen</ButtonLink>
    </div>
  );
}

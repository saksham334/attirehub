import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";

const SLIDES = [
  {
    title: "Wear your colors",
    text: "Fresh, fun and modern fashion for men, women and kids.",
    cta: "Shop new arrivals", to: "/shop?filter=new", theme: "hero-slide--purple",
  },
  {
    title: "Up to 30% off",
    text: "Sale pieces you'll actually wear, while stock lasts.",
    cta: "Shop the sale", to: "/shop?filter=sale", theme: "hero-slide--pink",
  },
  {
    title: "Step into the season",
    text: "Sneakers, boots and slip-ons for every day.",
    cta: "Shop shoes", to: "/shop?category=Shoes", theme: "hero-slide--teal",
  },
];

function HeroCarousel() {
  return (
    <Carousel interval={6000} pause="hover" indicators controls aria-label="Featured promotions">
      {SLIDES.map((s) => (
        <Carousel.Item key={s.title}>
          <div className={`hero-slide ${s.theme}`}>
            <div className="container text-center text-white">
              <h1 className="display-4 mb-3">{s.title}</h1>
              <p className="lead mb-4">{s.text}</p>
              <Link to={s.to} className="btn btn-light btn-lg rounded-pill px-5">{s.cta}</Link>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default HeroCarousel;
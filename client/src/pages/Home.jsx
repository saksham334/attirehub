import HeroCarousel from "../components/HeroCarousel";
import ValueBar from "../components/ValueBar";
import CategoryCards from "../components/CategoryCards";
import ProductRow from "../components/ProductRow";
import Countdown from "../components/Countdown";
import PromoBanners from "../components/PromoBanners";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

// Params objects live OUTSIDE the component so they never change between renders
const TRENDING = { sort: "popular", limit: 4 };
const FLASH = { filter: "sale", sort: "popular", limit: 4 };
const NEW_ARRIVALS = { filter: "new", sort: "newest", limit: 4 };
const FEATURED = { filter: "featured", limit: 4 };

function Home() {
  
  return (
    <>
      <HeroCarousel />
      <ValueBar />
      <CategoryCards />
      <ProductRow title="Trending now" params={TRENDING} viewAllTo="/shop?sort=popular" />

      <div className="flash-band">
        <ProductRow title="Flash sale" params={FLASH} viewAllTo="/shop?filter=sale">
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <span className="small">Ends tonight at midnight</span>
            <Countdown />
          </div>
        </ProductRow>
      </div>

      <PromoBanners />
      <ProductRow title="New arrivals" params={NEW_ARRIVALS} viewAllTo="/shop?filter=new" />
      <ProductRow title="Staff picks" params={FEATURED} viewAllTo="/shop" />
      <Testimonials />
      <Newsletter />
    </>
  );
}

export default Home;
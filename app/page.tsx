import { HeroCarousel } from "@/components/home/HeroCarousel";
import { PromoModal } from "@/components/home/PromoModal";
import { getHeroSlides, getPromo } from "@/lib/data/content.server";
import { Marquee } from "@/components/home/Marquee";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { About } from "@/components/home/About";
import { WhyUs } from "@/components/home/WhyUs";
import { Suppliers } from "@/components/home/Suppliers";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";

export const revalidate = 3600;

export default async function Home() {
  const [slides, promo] = await Promise.all([getHeroSlides(), getPromo()]);
  return (
    <>
      <PromoModal promo={promo} />
      <HeroCarousel slides={slides} />
      <Marquee />
      <Categories />
      <FeaturedProducts />
      <About />
      <WhyUs />
      <Suppliers />
      <Testimonials />
      <Contact />
    </>
  );
}

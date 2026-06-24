import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Marquee } from "@/components/home/Marquee";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { About } from "@/components/home/About";
import { WhyUs } from "@/components/home/WhyUs";
import { Suppliers } from "@/components/home/Suppliers";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <HeroCarousel />
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

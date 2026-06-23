import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { About } from "@/components/home/About";
import { WhyUs } from "@/components/home/WhyUs";
import { Suppliers } from "@/components/home/Suppliers";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
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

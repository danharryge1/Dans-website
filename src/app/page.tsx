import { Contact } from "@/components/sections/Contact";
import { FeaturedCase } from "@/components/sections/FeaturedCase";
import { Hero } from "@/components/sections/Hero/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services/Services";
import { SectionSeam } from "@/components/layout/SectionSeam";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <SectionSeam />
      <FeaturedCase />
      <SectionSeam />
      <SelectedWorks />
      <SectionSeam />
      <Philosophy />
      <SectionSeam />
      <Process />
      <SectionSeam />
      <Contact />
    </>
  );
}

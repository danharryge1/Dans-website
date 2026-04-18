import { FeaturedCase } from "@/components/sections/FeaturedCase";
import { Hero } from "@/components/sections/Hero/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedCase />
      <SelectedWorks />
      <Philosophy />
      <Process />
    </>
  );
}

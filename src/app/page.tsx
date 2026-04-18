import { Hero } from "@/components/sections/Hero/Hero";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <SelectedWorks />
    </>
  );
}

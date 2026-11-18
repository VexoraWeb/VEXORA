import { ContactSection } from "@/components/ContactSection";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { Packs } from "@/components/Packs";
import { Security } from "@/components/Security";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Packs />
      <Security />
      <Team />
      <FAQ />
      <ContactSection />
    </>
  );
}

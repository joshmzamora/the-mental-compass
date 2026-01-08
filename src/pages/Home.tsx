import { Hero } from "../components/Hero";
import { PageTransition } from "../components/PageTransition";
import { InteractiveMentalCompass } from "../components/InteractiveMentalCompass";
import { FeaturedNavigators } from "../components/FeaturedNavigators";
import { CompassInAction } from "../components/CompassInAction";

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <InteractiveMentalCompass />
      <FeaturedNavigators />
      <CompassInAction />
    </PageTransition>
  );
}
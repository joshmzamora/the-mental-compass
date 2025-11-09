import { BlogSection } from "../components/BlogSection";
import { GuidedJourneysSection } from "../components/GuidedJourneysSection";
import { PageTransition } from "../components/PageTransition";

export function Blog() {
  return (
    <PageTransition>
      <BlogSection />
      <GuidedJourneysSection />
    </PageTransition>
  );
}

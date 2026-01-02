import { Hero } from '@/components/Home/Hero';
import { AboutSection } from '@/components/Home/AboutSection';
import { CommitteesSection } from '@/components/Home/CommitteesSection';
import { NewsSection } from '@/components/Home/NewsSection';
import { SponsorsSection } from '@/components/Home/SponsorsSection';
import { ImageStrip } from '@/components/Home/ImageStrip';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AboutSection />
      <CommitteesSection />
      <NewsSection />
      {/* <SponsorsSection /> */}
      {/* <ImageStrip /> */}
    </div>
  );
};

export default Index;

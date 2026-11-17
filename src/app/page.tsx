import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';
import ModelsShowroom from '@/components/ModelsShowroom';
import FaqSection from '@/components/FaqSection';
import LocationContact from '@/components/LocationContact';

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <main>
        <ModelsShowroom />
        <FaqSection />
        <LocationContact />
      </main>
    </>
  );
}

import InteractiveStats from "../components/interactive-stats";
import HeroSection from "../components/hero";
import { Button } from "../components/ui/button";
import Link from "next/link";
import FeaturesSection from "../components/features";
import Pricing from "../components/pricing";


export default function Home() {
  return (
        <div className="pt-36">
      
      <HeroSection />
      <InteractiveStats />
      <FeaturesSection/>
      <Pricing />
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create Something Amazing?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already using AI to transform
            their images and bring their vision to life.
          </p>
          <Link href="/dashboard">
            <Button variant="primary" className="cursor-pointer" size="xl">
              🌟 Start Creating Now
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

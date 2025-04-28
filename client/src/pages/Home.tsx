import Hero from "@/components/Hero";
import PopularNeighborhoods from "@/components/PopularNeighborhoods";
import FeaturedListings from "@/components/FeaturedListings";
import JoinPlatform from "@/components/JoinPlatform";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import PropertyManagement from "@/components/PropertyManagement";
import LocalExperiences from "@/components/LocalExperiences";
import { Helmet } from 'react-helmet';
import { Separator } from "@/components/ui/separator";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>StayAfrika - Premium African Stays & Experiences</title>
        <meta name="description" content="Book curated, furnished stays with verified local hosts across African cities. Explore local experiences and property ownership programs. Discover authentic African hospitality with StayAfrika." />
      </Helmet>
      
      <Hero />
      <PopularNeighborhoods />
      <FeaturedListings />
      
      <Separator className="my-8" />
      
      {/* New feature sections */}
      <PropertyManagement />
      <LocalExperiences />
      
      <JoinPlatform />
      <Features />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;

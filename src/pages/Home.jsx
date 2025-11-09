import React from "react";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import WhyBuildHabits from "../components/WhyBuildHabits";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FeaturedHabits from "../components/FeaturedHabits";

const Home = () => {
  return (
    <div>
      <HeroSlider />
      <FeaturedHabits />
      <WhyBuildHabits />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default Home;

import React from "react";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import WhyBuildHabits from "../components/WhyBuildHabits";
import HowItWorks from "../components/HowItWorks";

const Home = () => {
  return (
    <div>
      <HeroSlider />
      <WhyBuildHabits />
      <HowItWorks />
    </div>
  );
};

export default Home;

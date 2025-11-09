import React, { useState } from "react";
import { Link } from "react-router";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { useTypewriter, Cursor } from "react-simple-typewriter";

const TypingEffect = ({ words, isActive }) => {
  const [text] = useTypewriter({
    words,
    loop: isActive,
    typeSpeed: 120,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  return (
    <>
      <span>{isActive ? text : words[0]}</span>
      <Cursor cursorStyle={isActive ? "_" : ""} />
    </>
  );
};

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="hero-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        className="h-[500px] md:h-[650px]"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        <SwiperSlide>
          <div className='hero h-full bg-[url("https://i.ibb.co/3mnTqhYd/meditation-min.png")] bg-cover bg-center'>
            <div className="hero-overlay bg-black/60 absolute inset-0"></div>
            <div className="hero-content relative z-10 text-center text-neutral-content">
              <div className="max-w-lg mx-auto">
                <h1 className="mb-5 text-4xl md:text-6xl font-bold">
                  Build Better Habits, <br /> Build{" "}
                  <TypingEffect
                    words={["Consistency.", "Productivity.", "Success."]}
                    isActive={activeIndex === 0}
                  />
                </h1>
                <p className="mb-5 text-lg">
                  Transform your daily routine. Start tracking your habits today
                  and build unstoppable streaks.
                </p>
                <Link to="/signup" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='hero h-full bg-[url("https://i.ibb.co.com/WW0fRQ4n/morning-running-min.png")] bg-cover bg-center'>
            <div className="hero-overlay bg-black/60 absolute inset-0"></div>
            <div className="hero-content relative z-10 text-center text-neutral-content">
              <div className="max-w-lg mx-auto">
                <h1 className="mb-5 text-4xl md:text-6xl font-bold">
                  Visualize Your{" "}
                  <TypingEffect
                    words={["Progress.", "Streaks.", "Growth."]}
                    isActive={activeIndex === 1}
                  />
                </h1>
                <p className="mb-5 text-lg">
                  Use our intuitive dashboard and charts to see your progress,
                  stay motivated, and never miss a day.
                </p>
                <Link to="/my-habits" className="btn btn-primary">
                  My Dashboard
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='hero h-full bg-[url("https://i.ibb.co.com/QjvhpBgr/tasks-min.png")] bg-cover bg-center'>
            <div className="hero-overlay bg-black/60 absolute inset-0"></div>
            <div className="hero-content relative z-10 text-center text-neutral-content">
              <div className="max-w-lg mx-auto">
                <h1 className="mb-5 text-4xl md:text-6xl font-bold">
                  Achieve Your{" "}
                  <TypingEffect
                    words={["Goals.", "Dreams.", "Potential."]}
                    isActive={activeIndex === 2}
                  />
                </h1>
                <p className="mb-5 text-lg">
                  Get inspired by public habits, set your reminders, and turn
                  your aspirations into achievements.
                </p>
                <Link to="/browse-public" className="btn btn-primary">
                  Browse Habits
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;

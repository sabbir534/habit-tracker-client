import React from "react";

import { motion } from "framer-motion";

import { FaBrain, FaSmileBeam, FaRocket, FaHeartbeat } from "react-icons/fa";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const WhyBuildHabits = () => {
  return (
    <motion.section
      className="py-20 bg-base-200"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Why Build Better Habits?</h2>
          <p className="mt-2 text-lg text-base-content/70">
            Small changes, compounded daily, lead to remarkable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div variants={cardVariants}>
            <div className="card h-full bg-base-100 shadow-xl text-center">
              <figure className="px-10 pt-10">
                <FaBrain className="text-6xl text-primary" />
              </figure>
              <div className="card-body items-center">
                <h3 className="card-title text-xl font-bold">Better Focus</h3>
                <p>
                  Consistent daily actions train your brain to concentrate,
                  reducing distractions.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="card h-full bg-base-100 shadow-xl text-center">
              <figure className="px-10 pt-10">
                <FaSmileBeam className="text-6xl text-secondary" />
              </figure>
              <div className="card-body items-center">
                <h3 className="card-title text-xl font-bold">Reduced Stress</h3>
                <p>
                  Habits create routine and predictability, which lowers anxiety
                  and gives you control.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="card h-full bg-base-100 shadow-xl text-center">
              <figure className="px-10 pt-10">
                <FaRocket className="text-6xl text-accent" />
              </figure>
              <div className="card-body items-center">
                <h3 className="card-title text-xl font-bold">
                  More Productivity
                </h3>
                <p>
                  By automating essential tasks, you free up mental energy for
                  complex challenges.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="card h-full bg-base-100 shadow-xl text-center">
              <figure className="px-10 pt-10">
                <FaHeartbeat className="text-6xl text-error" />
              </figure>
              <div className="card-body items-center">
                <h3 className="card-title text-xl font-bold">
                  Improved Health
                </h3>
                <p>
                  Small habits in fitness, diet, and mindfulness compound for
                  long-lasting well-being.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default WhyBuildHabits;

// src/components/Home/HowItWorks.jsx

import React from "react";
import { motion } from "framer-motion";
import { FaPlusSquare, FaCheckSquare, FaChartLine } from "react-icons/fa";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Each child will appear 0.3s after the previous one
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 50 }, // Start 50px below
  visible: {
    opacity: 1,
    y: 0, // Animate to original position
    transition: { type: "spring", stiffness: 80 },
  },
};
// ---

const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Start Your Journey in 3 Easy Steps
          </h2>
          <p className="mt-2 text-lg text-base-content/70">
            It's simple and intuitive to get started.
          </p>
        </div>

        {/* 1. Add 'motion' props to the grid container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Step 1: Create */}
          {/* 2. Add 'motion' props to each grid item */}
          <motion.div variants={stepVariants} className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl text-primary">
                <FaPlusSquare />
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">1. Create a Habit</h3>
            <p className="text-base-content/80">
              Define your new habit, set a category, and choose a reminder time.
            </p>
          </motion.div>

          {/* Step 2: Track */}
          <motion.div variants={stepVariants} className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl text-secondary">
                <FaCheckSquare />
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">2. Mark as Complete</h3>
            <p className="text-base-content/80">
              Check in daily and tap "Mark Complete" to log your progress
              instantly.
            </p>
          </motion.div>

          {/* Step 3: Succeed */}
          <motion.div variants={stepVariants} className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl text-accent">
                <FaChartLine />
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">3. Build Your Streak</h3>
            <p className="text-base-content/80">
              Watch your streak grow, view your progress, and build unstoppable
              momentum.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

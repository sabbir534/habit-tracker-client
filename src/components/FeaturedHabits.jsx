import React, { useState, useEffect } from "react";
import HabitCard from "./HabitCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(
          "https://habit-tracker-server-one.vercel.app/habits/featured"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHabits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Featured Habits</h2>
          <p className="mt-2 text-lg text-base-content/70">
            Get inspired by the newest habits from our community.
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && (
          <div role="alert" className="alert alert-error max-w-lg mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2.68V12a2.25 2.25 0 00-2.25-2.25h-5.378a2.25 2.25 0 00-2.25 2.25v.19l-1.06 1.06A2.25 2.25 0 003.75 16.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-2.685a2.25 2.25 0 00-.62-1.62l-1.06-1.06z"
              />
            </svg>
            <span>Error: {error}</span>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {habits.map((habit) => (
              <motion.div key={habit._id} variants={cardVariants}>
                <HabitCard habit={habit} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHabits;

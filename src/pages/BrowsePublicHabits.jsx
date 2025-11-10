// src/pages/BrowsePublicHabits/BrowsePublicHabits.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import HabitCard from "../components/HabitCard";

// --- Animation Variants ---
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

const BrowsePublicHabits = () => {
  const [allHabits, setAllHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Morning", "Work", "Fitness", "Evening", "Study"];

  // --- Fetch all public habits once ---
  useEffect(() => {
    const fetchAllPublicHabits = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/habits/public");
        if (!res.ok) throw new Error("Failed to fetch public habits");
        const data = await res.json();
        setAllHabits(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPublicHabits();
  }, []);

  // --- Debounce the search input (300ms delay) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Compute filtered habits dynamically ---
  const filteredHabits = useMemo(() => {
    return allHabits.filter((habit) => {
      const title = habit.title?.toLowerCase() || "";
      const description = habit.description?.toLowerCase() || "";
      const category = habit.category?.toLowerCase() || "";

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase();

      const matchesSearch =
        !debouncedSearch ||
        title.includes(debouncedSearch.toLowerCase()) ||
        description.includes(debouncedSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allHabits, debouncedSearch, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      {/* --- Page Title --- */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">Browse Public Habits</h1>
        <p className="mt-2 text-lg text-base-content/70">
          Find inspiration and see what others are tracking.
        </p>
      </div>

      {/* --- Search & Filter Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-base-200 rounded-lg shadow-md">
        {/* Search Input */}
        <div className="form-control flex-1">
          <label className="label-text mb-2 font-semibold">
            Search by keyword
          </label>
          <div className="join">
            <input
              type="text"
              placeholder="e.g., 'Morning Run', 'Study'"
              className="input input-bordered join-item w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary join-item" aria-label="Search">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Category Dropdown */}
        <motion.div
          layout
          className="form-control flex-1 md:max-w-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="label-text mb-2 font-semibold">
            Filter by category
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* --- Loading State --- */}
      {loading && (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* --- Error State --- */}
      {error && (
        <div role="alert" className="alert alert-error max-w-xl mx-auto">
          <span>Error: {error}</span>
        </div>
      )}

      {/* --- Habits Grid (Animated) --- */}
      {!loading && !error && (
        <AnimatePresence mode="wait">
          {filteredHabits.length > 0 ? (
            <motion.div
              key={selectedCategory + debouncedSearch} // ensures re-animation
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10 }}
            >
              {filteredHabits.map((habit) => (
                <motion.div key={habit._id} variants={cardVariants}>
                  <HabitCard habit={habit} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <h3 className="text-2xl font-semibold">No Habits Found</h3>
              <p className="text-base-content/70 mt-2">
                Try adjusting your search or filter terms.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default BrowsePublicHabits;

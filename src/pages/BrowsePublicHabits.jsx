import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaChevronDown, FaTimes } from "react-icons/fa";
import HabitCard from "../components/HabitCard";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Morning", "Work", "Fitness", "Evening", "Study"];

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
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredHabits = useMemo(() => {
    return allHabits.filter((habit) => {
      const title = habit.title?.toLowerCase() || "";
      const description = habit.description?.toLowerCase() || "";
      const category = habit.category?.toLowerCase() || "";

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase();

      const matchesSearch =
        !debouncedSearch || title.includes(debouncedSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allHabits, debouncedSearch, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">Browse Public Habits</h1>
        <p className="mt-2 text-lg text-base-content/70">
          Find inspiration and see what others are tracking.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <FaSearch className="inline mr-2" />
              Search by keyword
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="e.g., 'Morning Run', 'Study', 'Fitness'"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <FaSearch />
              </div>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Search"
              >
                <FaSearch className="text-sm" />
              </button>
            </div>
          </div>

          <motion.div
            layout
            className="flex-1 lg:max-w-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <FaFilter className="inline mr-2" />
              Filter by category
            </label>
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-white dark:bg-gray-700"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <FaChevronDown className="text-sm" />
              </div>
            </div>
          </motion.div>

          {(searchTerm || selectedCategory !== "All") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-end"
            >
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <FaTimes />
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

        {(searchTerm || selectedCategory !== "All") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Active filters:
              </span>
              {searchTerm && (
                <div className="badge badge-primary bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 px-3 py-1">
                  Search: "{searchTerm}"
                </div>
              )}
              {selectedCategory !== "All" && (
                <div className="badge badge-primary bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 px-3 py-1">
                  Category: {selectedCategory}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {loading && (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error max-w-xl mx-auto">
          <span>Error: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <AnimatePresence mode="wait">
          {filteredHabits.length > 0 ? (
            <motion.div
              key={selectedCategory + debouncedSearch}
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

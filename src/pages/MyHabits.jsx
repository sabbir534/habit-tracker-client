import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hook/useAxiosSecure";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaCheck, FaFire, FaPlus } from "react-icons/fa";

const calculateCurrentStreak = (completionHistory) => {
  if (!completionHistory || completionHistory.length === 0) {
    return 0;
  }

  const normalizedDates = new Set(
    completionHistory.map((d) => new Date(d).toISOString().split("T")[0])
  );

  let currentStreak = 0;
  const checkDate = new Date();

  const todayStr = checkDate.toISOString().split("T")[0];
  const hasCompletedToday = normalizedDates.has(todayStr);

  if (!hasCompletedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (normalizedDates.has(checkDate.toISOString().split("T")[0])) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return currentStreak;
};

const checkIfCompletedToday = (completionHistory) => {
  const todayStr = new Date().toISOString().split("T")[0];
  return completionHistory.some(
    (d) => new Date(d).toISOString().split("T")[0] === todayStr
  );
};

const MyHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get("/my-habits")
      .then((res) => {
        setHabits(res.data);
      })
      .catch((err) => {
        setError("Failed to load your habits.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosSecure]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/habits/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setHabits((prevHabits) => prevHabits.filter((h) => h._id !== id));
              Swal.fire("Deleted!", "Your habit has been deleted.", "success");
            }
          })
          .catch((err) => {
            toast.error(err.response?.data?.message || "Failed to delete");
          });
      }
    });
  };

  const handleMarkComplete = (id) => {
    axiosSecure
      .post(`/habits/${id}/complete`)
      .then((res) => {
        setHabits((prevHabits) =>
          prevHabits.map((h) => (h._id === id ? res.data : h))
        );
        toast.success("Habit marked complete!");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to mark complete");
      });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)]  flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your habits...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)]  flex justify-center items-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-error mb-4">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)]  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            My Habits
          </h1>
          <Link to="/add-habit" className="btn btn-primary">
            <FaPlus className="mr-2" />
            Add New Habit
          </Link>
        </div>

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <FaPlus className="text-4xl text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                No habits yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building better habits by adding your first one
              </p>
              <Link to="/add-habit" className="btn btn-primary">
                <FaPlus className="mr-2" />
                Add Your First Habit
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-left">Category</th>
                    <th className="text-center">Current Streak</th>
                    <th className="text-left">Created Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => {
                    const currentStreak = calculateCurrentStreak(
                      habit.completionHistory
                    );
                    const isCompletedToday = checkIfCompletedToday(
                      habit.completionHistory
                    );

                    return (
                      <tr
                        key={habit._id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          isCompletedToday
                            ? "bg-green-50 dark:bg-green-900/20"
                            : ""
                        }`}
                      >
                        <td>
                          <Link
                            to={`/habit/${habit._id}`}
                            className="font-bold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {habit.title}
                          </Link>
                          {isCompletedToday && (
                            <div className="badge badge-success badge-xs mt-1">
                              <FaCheck className="mr-1" />
                              Completed Today
                            </div>
                          )}
                        </td>

                        <td>
                          <div className="badge badge-ghost bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {habit.category}
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center justify-center">
                            <div className="flex items-center text-orange-600 dark:text-orange-400 font-bold">
                              <FaFire className="mr-1" />
                              {currentStreak}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="text-gray-600 dark:text-gray-400">
                            {new Date(habit.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td>
                          <div className="flex justify-center gap-2">
                            <button
                              className={`btn btn-sm ${
                                isCompletedToday ? "btn-success" : "btn-outline"
                              }`}
                              onClick={() => handleMarkComplete(habit._id)}
                              disabled={isCompletedToday}
                              title={
                                isCompletedToday
                                  ? "Completed today!"
                                  : "Mark Complete"
                              }
                            >
                              <FaCheck />
                            </button>

                            <Link
                              to={`/update-habit/${habit._id}`}
                              className="btn btn-sm btn-info"
                              title="Update"
                            >
                              <FaEdit />
                            </Link>

                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(habit._id)}
                              title="Delete"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHabits;

// src/pages/MyHabits/MyHabits.jsx

import React, { useState, useEffect, useMemo } from "react";
import useAxiosSecure from "../hook/useAxiosSecure";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaCheck } from "react-icons/fa";

// --- Helper functions (copied from HabitDetails page for reuse) ---

const calculateCurrentStreak = (completionHistory) => {
  const normalizedDates = new Set(
    completionHistory.map((d) => new Date(d).toISOString().split("T")[0])
  );
  let currentStreak = 0;
  const checkDate = new Date();
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

// --- Component ---

const MyHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  // 1. Fetch data on component mount
  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get("/my-habits")
      .then((res) => {
        setHabits(res.data);
      })
      .catch((err) => {
        setError("Failed to load your habits.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosSecure]);

  // 2. Handle Habit Deletion
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
              // Update UI instantly
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

  // 3. Handle Mark Complete
  const handleMarkComplete = (id) => {
    axiosSecure
      .post(`/habits/${id}/complete`)
      .then((res) => {
        // Update UI instantly with the new habit data from server
        setHabits((prevHabits) =>
          prevHabits.map((h) => (h._id === id ? res.data : h))
        );
        toast.success("Habit marked complete!");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to mark complete");
      });
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-error">
        <h2 className="text-2xl font-bold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">My Habits</h1>

      {habits.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">You haven't added any habits yet.</p>
          <Link to="/add-habit" className="btn btn-primary mt-4">
            Add a Habit
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table table-zebra w-full">
            {/* head */}
            <thead className="bg-base-200 text-lg">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Current Streak</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                // Calculate stats for each habit
                const currentStreak = calculateCurrentStreak(
                  habit.completionHistory
                );
                const isCompletedToday = checkIfCompletedToday(
                  habit.completionHistory
                );

                return (
                  <tr key={habit._id} className="hover">
                    <td>
                      <Link
                        to={`/habit/${habit._id}`}
                        className="font-bold hover:underline"
                      >
                        {habit.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-ghost">
                        {habit.category}
                      </span>
                    </td>
                    <td>
                      🔥 {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
                    </td>
                    <td>{new Date(habit.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        {/* Mark Complete Button */}
                        <button
                          className="btn btn-success btn-sm text-white"
                          onClick={() => handleMarkComplete(habit._id)}
                          disabled={isCompletedToday}
                          title={
                            isCompletedToday ? "Completed!" : "Mark Complete"
                          }
                        >
                          <FaCheck />
                        </button>
                        {/* Update Button */}
                        <Link
                          to={`/update-habit/${habit._id}`}
                          className="btn btn-info btn-sm text-white"
                          title="Update"
                        >
                          <FaEdit />
                        </Link>
                        {/* Delete Button */}
                        <button
                          className="btn btn-error btn-sm text-white"
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
      )}
    </div>
  );
};

export default MyHabits;

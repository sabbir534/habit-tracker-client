import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../hook/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

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

const calculateProgressPercent = (completionHistory) => {
  const normalizedDates = new Set(
    completionHistory.map((d) => new Date(d).toISOString().split("T")[0])
  );
  let daysCompleted = 0;
  const checkDate = new Date();
  for (let i = 0; i < 30; i++) {
    if (normalizedDates.has(checkDate.toISOString().split("T")[0])) {
      daysCompleted++;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return Math.round((daysCompleted / 30) * 100);
};

const checkIfCompletedToday = (completionHistory) => {
  const todayStr = new Date().toISOString().split("T")[0];
  return completionHistory.some(
    (d) => new Date(d).toISOString().split("T")[0] === todayStr
  );
};

const HabitDetails = () => {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/habits/${id}`)
      .then((res) => {
        setHabit(res.data);
      })
      .catch((err) => {
        setError("Failed to load habit details.");
        toast.error(
          "Failed to load habit. You may not be the owner or it may not be public."
        );
        navigate("/my-habits");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, axiosSecure, navigate]);

  const completionHistory = habit?.completionHistory || [];

  const currentStreak = useMemo(
    () => calculateCurrentStreak(completionHistory),
    [completionHistory]
  );

  const progressPercent = useMemo(
    () => calculateProgressPercent(completionHistory),
    [completionHistory]
  );

  const isCompletedToday = useMemo(
    () => checkIfCompletedToday(completionHistory),
    [completionHistory]
  );

  const isOwner = useMemo(() => {
    if (!user || !habit) {
      return false;
    }
    return user.email === habit.creatorEmail;
  }, [user, habit]);

  const handleMarkComplete = async () => {
    try {
      const res = await axiosSecure.post(`/habits/${id}/complete`);
      setHabit(res.data);
      toast.success("Habit marked complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark complete");
    }
  };

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
  if (!habit) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/2">
          <img
            src={
              habit.imageUrl ||
              "https://i.ibb.co.com/Tqq5j7p3/no-picture-available-icon.png"
            }
            alt={habit.title}
            className="w-full h-96 object-cover"
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <h1 className="card-title text-4xl font-bold">{habit.title}</h1>
          <span className="badge badge-secondary badge-lg my-2">
            {habit.category}
          </span>
          <p className="py-4">{habit.description}</p>
          <div className="divider">Creator Info</div>
          <p className="font-semibold">
            Name:{" "}
            <span className="font-normal">
              {habit.creatorName || user?.displayName}
            </span>
          </p>
          <p className="font-semibold">
            Email:{" "}
            <span className="font-normal">
              {habit.creatorEmail || user?.email}
            </span>
          </p>

          <div className="divider">Progress</div>

          <div className="flex justify-between items-center my-2 gap-4">
            <h3 className="text-xl font-bold">Current Streak:</h3>
            <div className="badge badge-primary badge-lg p-4">
              🔥 {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
            </div>
          </div>
          <div>
            <label className="label">
              <span className="label-text font-semibold">
                Last 30 Days Progress
              </span>
              <span className="label-text-alt font-bold">
                {progressPercent}%
              </span>
            </label>
            <progress
              className="progress progress-accent w-full"
              value={progressPercent}
              max="100"
            ></progress>
          </div>

          <div className="card-actions justify-end mt-6">
            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleMarkComplete}
              disabled={isCompletedToday || !isOwner}
              title={
                !isOwner
                  ? "You can only complete your own habits."
                  : isCompletedToday
                  ? "Already completed today!"
                  : "Mark Complete"
              }
            >
              {isCompletedToday ? "Completed Today!" : "Mark Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;

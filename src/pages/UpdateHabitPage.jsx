// src/pages/UpdateHabit/UpdateHabitPage.jsx

import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../hook/useAxiosSecure"; // Adjust path
import { AuthContext } from "../context/AuthContext"; // Adjust path
import axios from "axios";
import { toast } from "react-hot-toast";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const UpdateHabitPage = () => {
  const { id } = useParams(); // Get habit ID from URL
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Morning",
    reminderTime: "",
    isPublic: false,
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [submitting, setSubmitting] = useState(false); // For form submission

  // --- 1. Fetch Habit Data on Page Load ---
  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/habits/${id}`)
      .then((res) => {
        // Pre-fill the form with existing data
        setFormData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          reminderTime: res.data.reminderTime,
          isPublic: res.data.isPublic,
          imageUrl: res.data.imageUrl,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load habit data.");
        navigate("/my-habits"); // Redirect if they can't load it
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, axiosSecure, navigate]);

  // --- 2. Generic handler for text, select, and checkbox inputs ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- 3. Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let finalImageUrl = formData.imageUrl; // Keep old image by default

    // --- 3a. Upload new image if one is selected ---
    if (imageFile) {
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", imageFile);
      try {
        const res = await axios.post(IMGBB_UPLOAD_URL, imgbbFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          finalImageUrl = res.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("New image upload failed. Aborting update.");
        setSubmitting(false);
        return;
      }
    }

    // --- 3b. Prepare data and send PUT request ---
    const updatedHabitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      reminderTime: formData.reminderTime,
      isPublic: formData.isPublic,
      imageUrl: finalImageUrl, // Will be new or old URL
    };

    try {
      const res = await axiosSecure.put(`/habits/${id}`, updatedHabitData);
      if (res.data.modifiedCount > 0) {
        toast.success("Habit updated successfully!");
        navigate("/my-habits"); // Redirect back to the list
      } else {
        toast.error("No changes were made.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update habit.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 4. Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto p-8 bg-base-200 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Update Your Habit
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={user?.displayName || ""}
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className="divider">Edit Details</div>

          {/* Habit Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Habit Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered h-24"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Category & Reminder Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                className="select select-bordered"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Morning</option>
                <option>Work</option>
                <option>Fitness</option>
                <option>Evening</option>
                <option>Study</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Reminder Time</span>
              </label>
              <input
                type="time"
                name="reminderTime"
                className="input input-bordered"
                value={formData.reminderTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Re-upload Image (Optional)</span>
            </label>
            {formData.imageUrl && !imageFile && (
              <img
                src={formData.imageUrl}
                alt="Current"
                className="w-24 h-24 rounded-md object-cover mb-2"
              />
            )}
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={(e) => setImageFile(e.target.files[0])}
              accept="image/*"
            />
          </div>

          {/* Public Checkbox */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                name="isPublic"
                className="checkbox checkbox-primary"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span className="label-text">Make this habit public?</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHabitPage;

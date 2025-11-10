import React, { use, useState } from "react";

import useAxiosSecure from "../hook/useAxiosSecure";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const AddHabit = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Morning");
  const [reminderTime, setReminderTime] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const res = await axios.post(IMGBB_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          imageUrl = res.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    const newHabit = {
      title,
      description,
      category,
      reminderTime,
      imageUrl,
      creatorName: user.displayName,
      creatorEmail: user.email,
      isPublic: isPublic,
    };

    try {
      const res = await axiosSecure.post("/habits", newHabit);

      if (res.data.insertedId) {
        toast.success("Habit added successfully!");
        navigate("/my-habits");
      } else {
        throw new Error("Failed to add habit");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add habit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto p-8 bg-base-200 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8">Add a New Habit</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="divider">Habit Details</div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Habit Title</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 'Morning Run'"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Describe your habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                className="input input-bordered"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Image (Optional)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={(e) => setImageFile(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="label-text">Make this habit public?</span>
            </label>
            <div className="text-xs text-base-content/70 ml-10">
              Public habits will be visible to everyone on the "Browse" page.
            </div>
          </div>

          <div className="form-control mt-8">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Add Habit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabit;

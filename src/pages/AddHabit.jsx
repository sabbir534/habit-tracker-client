import React, { use, useState } from "react";
import useAxiosSecure from "../hook/useAxiosSecure";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import {
  FiClock,
  FiImage,
  FiTag,
  FiUser,
  FiMail,
  FiCheckSquare,
} from "react-icons/fi";
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
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
              Create a New Habit
            </h1>
            <p className="mt-2 text-purple-100 text-center max-w-md mx-auto">
              Build consistency by tracking your daily habits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <FiUser className="mr-2" />
                Your Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                      Your Name
                    </span>
                  </label>
                  <div className="flex items-center input input-bordered bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <FiUser className="mr-2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      className="grow bg-transparent outline-none text-gray-800 dark:text-gray-200"
                      value={user?.displayName || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                      Your Email
                    </span>
                  </label>
                  <div className="flex items-center input input-bordered bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <FiMail className="mr-2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      className="grow bg-transparent outline-none text-gray-800 dark:text-gray-200"
                      value={user?.email || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Habit Details
              </h2>

              <div className="space-y-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                      Habit Title
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 'Morning Run'"
                    className="input input-bordered w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-full"
                    placeholder="Describe your habit..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <FiTag className="mr-1" /> Category
                      </span>
                    </label>
                    <select
                      className="select select-bordered bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                      <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <FiClock className="mr-1" /> Reminder Time
                      </span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FiImage className="mr-1" /> Upload Image (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-primary w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      accept="image/*"
                    />
                    {imageFile && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Selected: {imageFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <div>
                      <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                        Make this habit public?
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Public habits will be visible to everyone on the
                        "Browse" page.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="loading loading-spinner mr-2"></span>
                    Creating Habit...
                  </span>
                ) : (
                  "Create Habit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHabit;

import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../hook/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FiClock,
  FiImage,
  FiTag,
  FiUser,
  FiMail,
  FiCheckSquare,
  FiEdit3,
} from "react-icons/fi";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const UpdateHabitPage = () => {
  const { id } = useParams();
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Morning",
    reminderTime: "",
    isPublic: false,
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/habits/${id}`)
      .then((res) => {
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
        //console.error(err);
        toast.error("Failed to load habit data.");
        navigate("/my-habits");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, axiosSecure, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let finalImageUrl = formData.imageUrl;

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
        //console.error(err);
        toast.error("New image upload failed. Aborting update.");
        setSubmitting(false);
        return;
      }
    }

    const updatedHabitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      reminderTime: formData.reminderTime,
      isPublic: formData.isPublic,
      imageUrl: finalImageUrl,
    };

    try {
      const res = await axiosSecure.put(`/habits/${id}`, updatedHabitData);
      if (res.data.modifiedCount > 0) {
        toast.success("Habit updated successfully!");
        navigate("/my-habits");
      } else {
        toast.error("No changes were made.");
      }
    } catch (err) {
      //console.error(err);
      toast.error("Failed to update habit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center flex items-center justify-center">
              <FiEdit3 className="mr-3" />
              Update Your Habit
            </h1>
            <p className="mt-2 text-purple-100 text-center max-w-md mx-auto">
              Make adjustments to your habit tracking
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
                Edit Details
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
                    name="title"
                    className="input input-bordered w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.title}
                    onChange={handleChange}
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
                    name="description"
                    className="textarea textarea-bordered h-24 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-full"
                    value={formData.description}
                    onChange={handleChange}
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
                      name="category"
                      className="select select-bordered bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                      <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <FiClock className="mr-1" /> Reminder Time
                      </span>
                    </label>
                    <input
                      type="time"
                      name="reminderTime"
                      className="input input-bordered bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.reminderTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FiImage className="mr-1" /> Update Image (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    {formData.imageUrl && !imageFile && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Current image:
                        </p>
                        <img
                          src={formData.imageUrl}
                          alt="Current habit image"
                          className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-primary w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      accept="image/*"
                    />
                    {imageFile && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        New image selected: {imageFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 p-0">
                    <input
                      type="checkbox"
                      name="isPublic"
                      className="checkbox checkbox-primary"
                      checked={formData.isPublic}
                      onChange={handleChange}
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
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <span className="loading loading-spinner mr-2"></span>
                    Updating Habit...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateHabitPage;

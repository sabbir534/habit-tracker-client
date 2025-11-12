import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaUserPlus,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (location.state?.from) {
      setRedirectMessage(
        `Please register to access ${location.state.from.pathname}`
      );
    }
  }, [location]);

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
    });
  }, [password]);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      setLoading(false);
      return;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      setLoading(false);
      return;
    }

    if (!imageFile) {
      toast.error("Please select a profile picture.");
      setLoading(false);
      return;
    }

    let imageUrl = "";
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
      //console.error(err);
      toast.error("Image upload failed. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const result = await createUser(email, password);
      //console.log("User created:", result.user);

      await updateUserProfile(name, imageUrl);

      //console.log("Profile updated");

      toast.success("Registration Successful!");
      navigate(from, { replace: true });
    } catch (error) {
      //console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        //console.log("Logged in with Google:", user);

        toast.success("Google Login Successful!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        //console.error(error);
        toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {redirectMessage && (
          <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-4 rounded-md">
            <div className="flex items-center">
              <FaArrowLeft className="mr-2" />
              <p>{redirectMessage}</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our community to start tracking your habits
          </p>
          {from !== "/" && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              You'll be redirected to your intended page after registration
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleEmailRegister} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaUser className="mr-2" /> Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaEnvelope className="mr-2" /> Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaCamera className="mr-2" /> Profile Picture
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                  {imageFile && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Selected: {imageFile.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaLock className="mr-2" /> Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="mt-2 space-y-1">
                  <div
                    className={`flex items-center text-xs ${
                      passwordStrength.length
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <FaCheck
                      className={`mr-1 ${
                        passwordStrength.length ? "block" : "hidden"
                      }`}
                    />
                    At least 6 characters
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      passwordStrength.uppercase
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <FaCheck
                      className={`mr-1 ${
                        passwordStrength.uppercase ? "block" : "hidden"
                      }`}
                    />
                    At least one uppercase letter
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      passwordStrength.lowercase
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <FaCheck
                      className={`mr-1 ${
                        passwordStrength.lowercase ? "block" : "hidden"
                      }`}
                    />
                    At least one lowercase letter
                  </div>
                </div>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="loading loading-spinner mr-2"></span>
                      Creating Account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleGoogleLogin}
                className="btn btn-outline w-full py-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
                disabled={loading}
              >
                <FaGoogle className="mr-2 text-red-500" />
                Google
              </button>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from: { pathname: from } }}
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 flex items-center justify-center inline-flex"
              >
                <FaUserPlus className="mr-1" />
                Login here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default Register;

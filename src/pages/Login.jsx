import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    signInUser(email, password)
      .then((result) => {
        toast.success("Login Successful!");

        navigate(from, { replace: true });
      })
      .catch((error) => {
        //console.error(error);
        if (error.code === "auth/invalid-credential") {
          toast.error("Invalid email or password.");
        } else {
          toast.error(error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithGoogle()
      .then((result) => {
        toast.success("Google Login Successful!");

        navigate(from, { replace: true });
      })
      .catch((error) => {
        //console.error(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your habit dashboard
          </p>

          {from !== "/" && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              You'll be redirected after login
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleEmailLogin} className="space-y-6">
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
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
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
              New to HabitTracker?{" "}
              <Link
                to="/register"
                state={{ from: from }}
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 flex items-center justify-center inline-flex"
              >
                <FaUserPlus className="mr-1" />
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;

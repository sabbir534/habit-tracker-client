// src/pages/Login/LoginPage.jsx

import React, { useState, use } from "react";
import { Link, useNavigate, useLocation } from "react-router";
// Import your AuthContext

import { toast } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  // Use the exact function names from your AuthProvider
  const { signInUser, signInWithGoogle } = use(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // This finds the page the user was on before being redirected to login
  const from = location.state?.from?.pathname || "/";

  // Handler for Email/Password Login
  const handleEmailLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    // Use signInUser from your context
    signInUser(email, password)
      .then((result) => {
        const user = result.user;
        console.log("Logged in user:", user);
        toast.success("Login Successful!");
        // Send user to their intended page
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/invalid-credential") {
          toast.error("Invalid email or password.");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Handler for Google Login
  const handleGoogleLogin = () => {
    // Use signInWithGoogle from your context
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        console.log("Logged in with Google:", user);
        toast.success("Google Login Successful!");

        // IMPORTANT: You should have a check in your AuthProvider or here
        // to save this Google user to your MongoDB 'users' collection
        // if this is their first time logging in.

        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  return (
    // Using min-h-[calc(100vh-120px)] to account for navbar/footer height
    <div className="hero min-h-[calc(100vh-120px)] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:ml-12">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Welcome back! Access your personal habit dashboard and continue your
            journey to building better habits.
          </p>
        </div>

        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleEmailLogin} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>

          {/* "OR" Divider */}
          <div className="divider px-8">OR</div>

          {/* Social Login */}
          <div className="card-body pt-0">
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline btn-primary"
            >
              <FaGoogle className="mr-2" />
              Continue with Google
            </button>
          </div>

          {/* Link to Register Page */}
          <p className="text-center pb-6">
            New to HabitTracker?{" "}
            <Link to="/register" className="link link-primary font-bold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

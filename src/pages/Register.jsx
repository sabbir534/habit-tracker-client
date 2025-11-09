// src/pages/Register/RegisterPage.jsx

import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router";

import { toast } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  // Get functions from our AuthContext
  const { createUser, updateUserProfile, signInWithGoogle } = use(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Handler for Email/Password Registration
  const handleEmailRegister = (e) => {
    e.preventDefault();

    // --- Password Validation ---
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    // --- Create User and Update Profile ---
    createUser(email, password)
      .then((result) => {
        const loggedInUser = result.user;
        console.log("User created:", loggedInUser);

        // Now, update the user's profile with name and photoURL
        updateUserProfile(name, photoURL)
          .then(() => {
            console.log("Profile updated");

            // TODO: Send user info (name, email) to your server
            // to be saved in the MongoDB 'users' collection.
            // Example: axios.post('/users', { email: user.email, name: user.displayName })

            toast.success("Registration Successful!");
            navigate("/"); // Navigate to home page after successful registration
          })
          .catch((error) => {
            console.error("Profile update error:", error);
            toast.error(error.message);
          });
      })
      .catch((error) => {
        console.error("Registration error:", error);
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already registered.");
        } else {
          toast.error(error.message);
        }
      });
  };

  // Handler for Google Login
  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        console.log("Logged in with Google:", user);

        // TODO: Send user info (name, email) to your server
        // to be saved in the MongoDB 'users' collection (if they are new).
        // Example: axios.post('/users', { email: user.email, name: user.displayName })

        toast.success("Google Login Successful!");
        navigate("/"); // Navigate to home page
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  return (
    <div className="hero min-h-[calc(100vh-120px)] bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left lg:mr-12">
          <h1 className="text-5xl font-bold">Sign up now!</h1>
          <p className="py-6">
            Join our community to start building, tracking, and mastering your
            daily habits. Your productivity journey begins here.
          </p>
        </div>

        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleEmailRegister} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="url"
                placeholder="Image URL"
                className="input input-bordered"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
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
                Sign Up
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

          {/* Link to Login Page */}
          <p className="text-center pb-6">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-bold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

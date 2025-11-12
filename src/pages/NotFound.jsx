import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="text-4xl font-bold mt-4">Page Not Found 😟</h2>
      <p className="text-lg text-base-content/70 mt-6">
        Oops! The page you are looking for does not exist.
      </p>
      <p className="text-base-content/70">
        It might have been moved or deleted.
      </p>

      <Link to="/" className="btn btn-primary mt-10">
        <FaHome className="mr-2" />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

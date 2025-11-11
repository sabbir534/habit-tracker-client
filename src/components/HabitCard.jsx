import React from "react";
import { Link } from "react-router";

const HabitCard = ({ habit }) => {
  const { _id, title, description, creatorName, imageUrl } = habit;

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="card h-full bg-base-100 shadow-xl transition-all hover:shadow-2xl">
      <figure className="h-56">
        <img
          src={
            imageUrl ||
            "https://i.ibb.co.com/Tqq5j7p3/no-picture-available-icon.png"
          }
          alt={title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-sm text-base-content/70 mb-2">
          By: {creatorName || "Anonymous"}
        </p>
        <p>{truncateDescription(description, 100)}</p>
        <div className="card-actions justify-end mt-4">
          <Link to={`/habits/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;

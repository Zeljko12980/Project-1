/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const RatingStar: FC<{ rating: number }> = ({ rating }) => {
  // Ensure rating is a valid number between 0 and 5
  const ratingNum = Math.min(Math.max(Number(rating), 0), 5); // Clamp rating between 0 and 5
  
  // Make sure the ratingNum is a valid number
  if (isNaN(ratingNum)) {
    console.error("Invalid rating value:", rating);
    return <div>Error: Invalid rating</div>; // Fallback if rating is invalid
  }

  const filledStars = Math.floor(ratingNum); // Number of filled stars
  const emptyStars = 5 - filledStars; // Number of empty stars

  // Create an array of filled stars and empty stars based on the rating
  const filledStarsArray = new Array(filledStars).fill(<AiFillStar />);
  const emptyStarsArray = new Array(emptyStars).fill(<AiOutlineStar />);

  return (
    <div className="flex items-center text-[#ffb21d]">
      {/* Render the filled and empty stars */}
      {filledStarsArray}
      {emptyStarsArray}
      <span className="ml-2 text-gray-600 font-semibold dark:text-white">
        {ratingNum.toFixed(1)} {/* Display rating with one decimal place */}
      </span>
    </div>
  );
};

export default RatingStar;

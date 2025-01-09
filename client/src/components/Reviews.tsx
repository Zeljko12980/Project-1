import { FC, useEffect, useState } from "react";
import RatingStar from "./RatingStar";
import { fetchReviews, createReview } from "../../src/redux/features/reviewSlice";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { AddReviewDto } from "../models/AddReviewDto";
import { useNavigate } from "react-router-dom";


const Reviews: FC<{ id: number }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state: RootState) => state.reviewReducer.reviews);
  const reviewStatus = useAppSelector((state: RootState) => state.reviewReducer.status);
  //const error = useAppSelector((state: RootState) => state.reviewReducer.error);

  const [newReview, setNewReview] = useState<string>(""); 
  const [newRating, setNewRating] = useState<number>(5); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  const [userId, setUserId] = useState<string>(""); 
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const userId = localStorage.getItem("userId");
  
    if (userId) {
      console.log("User Id: "+userId)
      setIsLoggedIn(true);
      setUserId(localStorage.getItem("userId") || "");
      
    }
  }, []);

  // Fetch reviews only once when component mounts
  useEffect(() => {
    if (reviewStatus === "idle") {
      dispatch(fetchReviews(id));
    }
  }, [dispatch, reviewStatus, id]);

  const handleReviewSubmit = () => {
    if (!isLoggedIn) {
      return; // Don't allow review submission if not logged in
    }

    if (newReview.trim()) {
      const newReviewItem: AddReviewDto = {
        comment: newReview,
        rating: newRating,
        productId: id,
        userId: userId ? userId : "",
      };

      // Dispatch createReview to add review to backend
      dispatch(createReview(newReviewItem));

      // Clear the form after submission
      setNewReview("");
      setNewRating(5);
      navigate(`/product/${id}`, { replace: true });

      // Scroll to the top of the page after navigation
      window.scrollTo(0, 0);
    }
  };

  //if (reviewStatus === "loading") return <div>Loading...</div>;
  //if (reviewStatus === "failed") return <div>Error: {error}</div>;

  return (
    <div className="w-full px-0 py-4"> {/* Full width and no horizontal padding */}
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6 px-6">Reviews</h1>

      <div className="max-h-[400px] overflow-y-auto">
        <div className="space-y-6">
          {reviews?.length > 0 ? (
            reviews.map(({ id, reviewerName, rating, comment }) => (
              <div key={id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow mx-6">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-100">{reviewerName}</h3>
                <RatingStar rating={rating ?? 0} />
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{comment}</p>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mx-6">
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-100">No reviews yet. Be the first to review!</h3>
              </div>)}
              {isLoggedIn && (
                <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mx-6">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Write a Review</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-200 font-medium">Rating:</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
                        disabled={!isLoggedIn}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <option key={star} value={star}>
                            {star} Star{star > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-200 font-medium">Review:</label>
                      <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
                        rows={4}
                        placeholder="Write your review here..."
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <button
                      onClick={handleReviewSubmit}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-300"
                      disabled={!isLoggedIn}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          
        </div>
      </div>
    
  );
};

export default Reviews;

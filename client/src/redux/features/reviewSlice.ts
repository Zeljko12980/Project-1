import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ReviewItem } from "../../models/ReviewItem";
import axios from "axios";
import { AddReviewDto } from "../../models/AddReviewDto";
import { fetchProductDetails } from "./productSlice";

// Define the initial state of the reviews
interface ReviewsState {
  reviews: ReviewItem[];
  status: "idle" | "loading" | "failed" | "succeeded";
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk<ReviewItem[], number>(
    'reviews/fetchReviews', 
    async (productId) => {
      const response = await axios.get(`http://localhost:5157/api/review/${productId}`);
      
      console.log(response.data);
     
      // Send the productId to the API
      return response.data; // Assuming the response is an array of reviews
    }
);

// Async thunk for creating a review
export const createReview = createAsyncThunk<ReviewItem, AddReviewDto>(
    'reviews/createReview',
    async (reviewData: AddReviewDto, thunkAPI) => {
      try {
        // Prepare the body as JSON
        const body = JSON.stringify({
          productId: reviewData.productId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          userId: reviewData.userId,
        });
  
        // Send POST request with custom headers
        const response = await axios.post('http://localhost:5157/api/review', body, {
          headers: {
            'Content-Type': 'application/json', // Standard JSON content type
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Optional: Use Authorization header if needed
            'X-Custom-Header': 'CustomValue', // Example of a custom header if needed
          },
        });
   
        // Dispatch the fetchReviews action to update the reviews after creating a new one

        console.log ("Id" +reviewData.productId);
        thunkAPI.dispatch(fetchReviews(reviewData.productId));
        thunkAPI.dispatch(fetchProductDetails(reviewData.productId.toString()));
            
  
        return response.data; // Return the newly created review
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || 'Failed to create review');
      }
    }
  );

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<ReviewItem[]>) => {
        state.status = "succeeded";
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        //state.status = "failed";
        state.error = action.error.message || "Failed to fetch reviews";
        state.reviews=[];
      })
      .addCase(createReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<ReviewItem>) => {
        state.status = "succeeded";
        state.reviews.unshift(action.payload); // Add new review to the beginning of the list
      })
      .addCase(createReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create review";
      });
  },
});

export default reviewSlice.reducer;

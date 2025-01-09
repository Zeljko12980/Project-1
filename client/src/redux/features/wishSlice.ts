import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '../../models/Product';

// API URL for wishlist endpoints
const API_URL = 'http://localhost:5157/api/WishList'; // Adjust as per your API endpoint


interface wishState{
  wishlist:Product[]|null;
  loading: boolean;
  totalProducts: number;
  totalPages: number;
// error: string;
}

// Thunk for fetching wishlist products
export const fetchWishlist = createAsyncThunk<
  { products: Product[]; totalProducts: number; totalPages: number }, // Data we want to return
  { pageNumber: number; pageSize: number; searchTerm?: string } // Parameters to pass
>(
  'wish/fetchWish',
  async ({ pageNumber, pageSize, searchTerm }) => {
    const userId = localStorage.getItem('userId'); // Assuming you store the userId in localStorage
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Construct the URL with optional searchTerm
    const url = new URL(`http://localhost:5157/api/WishList/${userId}`);
    url.searchParams.append('pageNumber', pageNumber.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }

    const data = await response.json();

    return {
      products: data.products, // Adjusted to match response structure
      totalProducts: data.totalCount, // Adjusted based on response
      totalPages: data.totalPages,
    };
  }
);


// Thunk for adding a product to the wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userId, productId }: { userId: string; productId: number }, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5157/api/WishList',
        { userId, productId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ); 
      // const userId=localStorage.getItem("userId");
      thunkAPI.dispatch(fetchWishlist(userId));
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Thunk for removing a product from the wishlist
export const removeFromWishlist = createAsyncThunk<Product, any>(
  'wishlist/removeFromWishlist',
  async ({ userId, productId }, thunkAPI) => {
    try {
      userId = localStorage.getItem("userId") || ''; // Ensure a value exists
      const response = await axios.delete(`${API_URL}?userId=${userId}&productId=${productId}`);
      return response.data as Product; // Return the removed product
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the wishlist slice
const initialState:wishState = {
  wishlist: [],
  loading: false,
  totalProducts: 0,
  totalPages: 0,
 // error: null,
};

// Wishlist slice definition
// Wishlist slice definition
const wishSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })

      // Add product to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist?.push(action.payload); // Add the product to the wishlist
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove product from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;  // Set loading to true while the data is being fetched
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;  // When the product is successfully removed
        // Ensure wishlist is always an array, even if it's null or undefined
        state.wishlist = (state.wishlist || []).filter(item => item.id !== action.payload.id);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;  // If there is an error
        state.error = action.payload as string;
      });
  },
});


// Export actions (if any)
export default wishSlice.reducer;

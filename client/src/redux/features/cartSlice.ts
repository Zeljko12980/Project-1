import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { CartSlice } from "../../models/CartSlice";

const API_BASE_URL = "http://localhost:5157/api/Cart";

// Initial state
const initialState: CartSlice = {
  cartOpen: false,
  cartItems: [],
};

// Thunks for interacting with the Cart API

// Fetch the cart (POST request)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token is missing");
      }

      const response = await fetch(`${API_BASE_URL}/GetCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ UserId: userId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue("Unauthorized");
        }
        throw new Error(`Failed to fetch cart: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(`Error: ${error.message}`);
    }
  }
);

// Add item to the cart (POST request)
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (data: { userId: string; itemId: number; quantity: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/AddToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          UserId: data.userId,
          ItemId: data.itemId,
          Quantity: data.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add item: ${response.statusText}`);
      }

      // Dispatch fetchCart to refresh the cart after adding the item
      dispatch(fetchCart(data.userId));

      const result = await response.json();
      return result; // Return the updated cart after adding the item
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

// Update item quantity in the cart (POST request)
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (data: { userId: string; itemId: number; quantity: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/UpdateCartItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          UserId: data.userId,
          ItemId: data.itemId,
          Quantity: data.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`);
      }

      // Dispatch fetchCart to refresh the cart after updating the item
      dispatch(fetchCart(data.userId));

      const result = await response.json();
      return result; // Return the updated cart after updating the item quantity
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

// Remove item from the cart (POST request)
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (data: { userId: string; itemId: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/RemoveFromCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          UserId: data.userId,
          ItemId: data.itemId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.statusText}`);
      }

      // Dispatch fetchCart to refresh the cart after removing the item
      dispatch(fetchCart(data.userId));

      const result = await response.json();
      return result; // Return the updated cart after removing the item
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

// Decrease item quantity in the cart (POST request)
export const decreaseCartItemQuantity = createAsyncThunk(
  "cart/decreaseCartItemQuantity",
  async (data: { userId: string; itemId: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DecreaseCartItemQuantity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          UserId: data.userId,
          ItemId: data.itemId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to decrease item quantity: ${response.statusText}`);
      }

      // Dispatch fetchCart to refresh the cart after decreasing the item quantity
      dispatch(fetchCart(data.userId));

      const result = await response.json();
      return result; // Return the updated cart after decreasing item quantity
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartState: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      state.cartOpen = action.payload.isOpen;
    },
    emptyCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      })
      .addCase(decreaseCartItemQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        console.error("Failed to fetch cart:", action.payload);
      })
      .addCase(addCartItem.rejected, (state, action) => {
        console.error("Failed to add item:", action.payload);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        console.error("Failed to update item:", action.payload);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        console.error("Failed to remove item:", action.payload);
      })
      .addCase(decreaseCartItemQuantity.rejected, (state, action) => {
        console.error("Failed to decrease item quantity:", action.payload);
      });
  },
});

export const { setCartState, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;

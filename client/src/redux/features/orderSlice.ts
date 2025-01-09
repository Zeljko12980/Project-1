import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { emptyCart } from './cartSlice';
import toast from 'react-hot-toast';
// Model za stavke u korpi
export interface CartItemDto {
  productId: number;
  title: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  orderItemId: number;
  title: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnail:string;
}

export interface Order {
  orderId: number;
  customerName: string;
  shippingAddress: string;
  orderDate: string; // Možeš koristiti `Date` tip ako koristiš pravi JavaScript objekat
  isPaid: boolean;
  orderStatus:string;
  items: OrderItem[];
  totalOrderPrice: number;
  
}


interface OrderState
{
  order: Order| null;
  status: string;
  //error: object;
  isPaid: boolean;
  orders:Order[]|[];
  totalOrders:number;
  totalPages:number;
  thisOrder:Order| null;
}

const initialState:OrderState=
{
  order: null,
  status: 'idle',
 // error: null,
  isPaid: false,
  orders:[],
  totalOrders:0,
  totalPages:0,
  thisOrder:null
}

// Model za narudžbinu
export interface OrderData {
  customerName: string;
  shippingAddress: string;
  orderDate: string; // Datum u ISO 8601 formatu
  orderStatusId: number; // Status narudžbine (npr. 1, 2, 3...)
  isPaid: boolean; // Da li je plaćeno
  userId: string; // ID korisnika
  CartItems: CartItemDto[]; // Lista stavki u korpi
  
}


export const deleteOrder = createAsyncThunk<any, { id: number }>(
  'order/deleteOrder',
  async ({ id }, thunkAPI) => {
    try {
      const response = await axios.delete(`http://localhost:5157/api/Order/${id}`);
      return response.data;  // Pretpostavljamo da server vraća neki odgovor.
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: OrderData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5157/api/Order', orderData);
      
      // Log the response data for debugging
      //console.log("Response:", response.data);
      
      // Dispatch actions like emptying the cart if needed
       thunkAPI.dispatch(emptyCart());
      
  toast.success("Order created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.log('Error response data:', error.response.data);

        // Check for the specific "Insufficient stock" message
        if (
          typeof error.response.data === 'string' &&
          error.response.data.startsWith('Insufficient stock for product ID')
        ) {
          toast.error(error.response.data); // Display the error as a toast notification
        }

        return thunkAPI.rejectWithValue(error.response.data);
      }

      console.error('Error without response:', error.message);
      toast.error(error.message); // Display a general error message if no response
      return thunkAPI.rejectWithValue(error.message);
  }
}
);

export const fetchAllOrders = createAsyncThunk<
  { orders: Order[]; totalOrders: number; totalPages: number }, // The data we want to return
  { pageNumber: number; pageSize: number; searchTerm?: string } // Added searchTerm as optional
>(
  'order/fetchAllOrders',
  async ({ pageNumber, pageSize, searchTerm }) => {
    // Construct the URL with optional searchTerm
    const url = new URL('http://localhost:5157/api/Order');
    url.searchParams.append('pageNumber', pageNumber.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }

    const response = await fetch(url.toString(), {
      method: 'GET', // or 'PUT', 'PATCH', etc., depending on your request type
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`, // Replace `token` with your actual token variable
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    const totalOrders = data.totalCount; // Adjust this according to your response structure
    const totalPages = data.TotalPages;

    //console.log("Total products: " + totalProducts);

    return {
      orders: data.orders,
      totalOrders,
      totalPages,
    };
  }
);


export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ orderId, orderData }: { orderId: number; orderData: Partial<OrderData> }, thunkAPI) => {
    try {
      const response = await axios.put(`http://localhost:5157/api/Order/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.status = 'idle';
      //state.error = null;
    },
    completeOrder: (state) => {
      state.isPaid = true; // Postavi stanje kao plaćeno
    },
    resetOrder: (state) => {
      state.isPaid = false; // Resetuj stanje
    },
    setOrder: (state,action) => {
      state.thisOrder = action.payload; // Resetuj stanje
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
      //  state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
       // state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled,  (state, action: PayloadAction<{ orders: Order[]; totalOrders: number; totalPages: number }>) => {
             //   state.loading = false;
                state.orders = action.payload.orders;
                state.totalOrders = action.payload.totalOrders;
                state.totalPages = action.payload.totalPages;
              })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed';
      //  state.error = action.payload; // Poruka o grešci
      })
       .addCase(deleteOrder.pending, (state) => {
              state.status = 'loading';
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.orders.reduce(action.payload);
              //state.allProducts=action.payload;
          
              // Update state with the new list
            })
            .addCase(deleteOrder.rejected, (state, action) => {
              state.status = 'failed';
              //state.error = action.payload.error;
            })
            .addCase(updateOrder.pending, (state) => {
              state.status = 'loading';
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
              state.status = 'succeeded';
              // Find the updated order and update it in the orders list
              //const updatedOrder = action.payload;
              state.orders = action.payload;
            })
            .addCase(updateOrder.rejected, (state, action) => {
              state.status = 'failed';
             //state.error = action.payload as string; // Capture error message
            });
  },
});

export const { resetOrderState, completeOrder, resetOrder,setOrder } = orderSlice.actions;
export default orderSlice.reducer;

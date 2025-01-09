// src/redux/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { emptyCart, fetchCart } from "./cartSlice"; // Importing setCartItems from cartSlice

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { fetchNotifications } from "./notificationSlice";
import { fetchWishlist } from "./wishSlice";


interface LoginProps {
  UserName: string;
  Password: string;
}
interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  adress:string;
  city:string;
  postalCode:string;
  states:string;
  phoneNumber:number;
}


interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  birthDate: Date; // Use string to capture the date as a string (e.g., "2006-04-06")
  age: number;
  city: string;
  postalCode: string;
  state: string;
  address: string; // Corrected from 'adress' to 'address'
  phoneNumber: string;
}


interface AuthState {
  modalOpen: boolean;
  modalType: 'login' | 'register'|"update"|"editproduct"|"editOrder"|"showOrder";
  isLoggedIn: boolean;
  userDetails:User | null;
  username: string;
  loading: boolean;
  error: string | null;
  isAdmin:boolean;
  users:User[]|null;
  user:User|null;
  edituser:User|null;
}
export interface UserDetails {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  age: number;
  city: string;
  postalCode: string;
  state: string;
}

// Define initial state
const initialState: AuthState = {
  isLoggedIn:
    localStorage.getItem("username") !== null &&
    localStorage.getItem("username") !== undefined &&
    localStorage.getItem("username") !== "",
  modalOpen: false,
  username: localStorage.getItem("username") ?? "",
  modalType: 'login',
  loading: false,
  userDetails:null,
  error: null,
  isAdmin:false,
  users:[],
  user:null,
  edituser:null,
};

// Combined method to retrieve userId, username, and token from localStorage
export const getAuthData = () => {
  const userId = localStorage.getItem("userId") ?? "";
  const username = localStorage.getItem("username") ?? "";
  const token = localStorage.getItem("token") ?? "";
  return { userId, username, token };
};

 // Adjust this import to the correct path

export const editUser1 = createAsyncThunk(
  'auth/editUser', // Defining the action name
  async ({ userData, userId }: { userData: UserDetails; userId: string }, thunkAPI) => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      // Prepare the request body with updated user data
      const response = await fetch(`http://localhost:5157/api/Account/edit/${userId}`, {
        method: 'PUT', // Use PUT method to update user data
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token for authorization
        },
        body: JSON.stringify(userData), // Updated user data
      });

    

      // Get the response in JSON format
      const data = await response.json();

      // Return data to be stored in Redux state
      return data;
    } catch (error) {
      // Reject the action with an error message
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Create async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const { userId } = getAuthData();  // Use the combined method to get auth data
      if (!userId) {
        throw new Error('User ID not found');
      }
      thunkAPI.dispatch(fetchCart(userId));   

      const response = await fetch('http://localhost:5157/api/Account/currentUser', {
        method: 'GET', // Use POST instead of GET to send a body
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token if needed
        }

        
       
      });
     
      thunkAPI.dispatch(fetchCart(userId)); 

      const data = await response.json();
      // Set cart items
      console.log("Uspjesno: "+data);
   
      return data; // Return user data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue("Token not found");
      }

      // Pošaljite zahtev za brisanje korisnika
      const response = await axios.delete(`http://localhost:5157/api/Account/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete user");
      }
      thunkAPI.dispatch(getAllUsers());

      // Vrati ID korisnika koji je obrisan
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);
// Create async thunk for login
export const doLogin = createAsyncThunk(
  'auth/login',
  async (credentials: LoginProps, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5157/api/Account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      

      const data = await response.json();

      //console.log("Data"+ data.token);

      // Decode the JWT token
      const decodedToken: any = jwtDecode(data.token); // Assuming 'data.token' contains the JWT token

      console.log("Token: "+decodedToken);
      // Get data from the decoded token (example: userId, username, etc.)
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      // Store user data and token in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", data.token);
       // Store the token in localStorage if needed

      // Set cart items from the response data
      thunkAPI.dispatch(fetchCart(userId));
      thunkAPI.dispatch(fetchNotifications(userId));
      thunkAPI.dispatch(fetchWishlist(userId));   // Set cart items in the store

      return { username, userId, token: data.token }; // Return the relevant data for Redux
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const getAllUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "auth/getAllUsers",
  async (_, thunkAPI) => {
    try {
      // Dohvatanje tokena iz localStorage
      const token = localStorage.getItem("token");

      // Provjera da li postoji token
      if (!token) {
        return thunkAPI.rejectWithValue("Token not found");
      }
      console.log("Poslati token: "+token);
      // Postavljanje tokena u Authorization header
      const response = await axios.get("http://localhost:5157/api/Account/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
          console.log("Primljeni token:");
          console.log(response.data);
      return response.data;  // Ovdje vraća User[] tip
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const doLogout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    // Ukloni podatke iz localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");

    // Očisti korpu i resetuj stanje
    thunkAPI.dispatch(emptyCart());
  }
);


// Create async thunk for registration
export const doRegister = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterProps, thunkAPI) => {
    try {
      console.log("Registering with data:", registerData);

      const response = await fetch('http://localhost:5157/api/Account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed:', errorText);
        throw new Error('Registration failed');
      }

     thunkAPI.dispatch(fetchCurrentUser());
    

      const data = await response.json();
     
      // After successful registration, navigate to the homepage
      // You can dispatch the navigation action here, but `useNavigate` can only be used inside components
      // For now, just return the success message (or user data if you need to show confirmation)
      return data;  // You can return a message or status if needed
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);


export const doRegisterAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (registerData: RegisterProps, thunkAPI) => {
    try {
      console.log("Registering with data:", registerData);

      const response = await fetch('http://localhost:5157/api/Account/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed:', errorText);
        throw new Error('Registration failed');
      }

     thunkAPI.dispatch(getAllUsers());
    

      const data = await response.json();
     
      // After successful registration, navigate to the homepage
      // You can dispatch the navigation action here, but `useNavigate` can only be used inside components
      // For now, just return the success message (or user data if you need to show confirmation)
      return data;  // You can return a message or status if needed
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);


const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    setModalType: (state, action: PayloadAction<'login' | 'register'|'update'|'editproduct'|'editOrder'|"showOrder">) => {
      state.modalType = action.payload;
    },
    setUser:(state,action)=>{
      state.user=action.payload;
    },
    setEditUser:(state,aciton)=>{
      state.edituser=aciton.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(doLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        const data = action.payload;
        const decodedToken: any = jwtDecode(data.token);
      
        // Decode and extract user details from the JWT token
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const email = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const firstName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
        const lastName=decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
        const adress=decodedToken["Adress"];
        const city=decodedToken["City"];
        const postalCode=decodedToken["PostalCode"];
        const states=decodedToken["Country"];
        const phoneNumber=decodedToken["PhoneNumber"];
        const isAdmin = roles && roles.includes("Admin");
        // Create a userDetails object and assign it to the state
        state.userDetails   = {
          id: userId,
          username,
          email,
          roles,
          firstName,
          lastName,
          adress,
          city,
          postalCode,
          states,
          phoneNumber,
          
        };
      
        state.username = username;
        state.isLoggedIn = true;
        state.modalOpen = false;
        state.loading = false;
        state.isAdmin=roles && roles.includes("Admin")? true:false;
      })
      
      .addCase(doLogin.rejected, (state, action) => {
        console.error('Login failed:', action.payload);
        state.error = action.payload as string;
        state.loading = false;
      })
      // Handle logout
      .addCase(doLogout.fulfilled, (state) => {
        state.username = "";
        state.isLoggedIn = false;
      })
      .addCase(doLogout.rejected, (state, action) => {
        console.error('Logout failed:', action.payload);
        state.error = action.payload as string;
      })
      // Handle registration
      .addCase(doRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.username = "";
      })
      .addCase(doRegister.fulfilled, (state, action) => {
        //const data = action.payload;
        state.username = ""; // Ensure the username is set after successful registration
        state.isLoggedIn = true;
        state.modalOpen = false;
        state.loading = false;
        // Optionally, you can store the username in localStorage as well
       // localStorage.setItem("username", data.username);
      })
      .addCase(doRegister.rejected, (state, action) => {
        console.error('Registration failed:', action.payload);
        state.error = action.payload as string;
        state.loading = false;
      })
      // Handle fetching current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const data = action.payload;
        const userId = data.id;
        const username = data.userName;
        const email = data.email
        const roles = ["User"];
        const firstName = data.firstName;
        const lastName=data.lastName;
        const adress=data.address;
        const city=data.city;
        const postalCode=data.postalCode;
        const states=data.state;
        const phoneNumber=data.phoneNumber;
        const isAdmin = roles && roles.includes("Admin");
        // Create a userDetails object and assign it to the state
        state.userDetails   = {
          id: userId,
          username,
          email,
          roles,
          firstName,
          lastName,
          adress,
          city,
          postalCode,
          states,
          phoneNumber,
          
        };

        console.log("STate: "+state.userDetails);
       
      
       state.username=username;
        state.isLoggedIn = true;
       
        state.loading = false;
        state.isAdmin=roles && roles.includes("Admin")? true:false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.error('Fetching user failed:', action.payload);
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch users.";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;

        // Ukloni korisnika iz liste korisnika u Redux store-u
        if (state.users) {
          state.users = state.users.filter((user) => user.id !== userId);
        }

        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(editUser1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser1.fulfilled, (state, action) => {
        state.loading = false;
        state.edituser = action.payload; // Update user details with the new data
      })
      .addCase(editUser1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(doRegisterAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.username = "";
      })
      .addCase(doRegisterAdmin.fulfilled, (state, action) => {
        //const data = action.payload;
       // state.username = ""; // Ensure the username is set after successful registration
        state.isLoggedIn = true;
        //state.modalOpen = false;
        state.loading = false;
        // Optionally, you can store the username in localStorage as well
       // localStorage.setItem("username", data.username);
      })
      .addCase(doRegisterAdmin.rejected, (state, action) => {
        console.error('Registration failed:', action.payload);
        state.error = action.payload as string;
        state.loading = false;
      })
  },
});


export const { updateModal, setModalType,setUser, setEditUser } = authSlice.actions;
export default authSlice.reducer;

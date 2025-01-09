
import "./App.css";
import {  useAppDispatch } from "./redux/store"; // Ensure this import is correct
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import SingleProduct from "./pages/SingleProduct";
import LoginModal from "./components/LoginModal";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile, { Component, Sales } from "./pages/Component";
import AllProducts from "./pages/AllProducts";
import ScrollToTopButton from "./components/ScrollToTopButton";
import BannerPopup from "./components/BannerPopup";
import AllCategories from "./pages/AllCategories";
//import SingleCategory from "./pages/SingleCategory";
import DriftChat from "./pages/DriftChat";
import CheckoutPage from "./components/CheckoutPage";
import { useEffect } from "react";
import { doLogout, fetchCurrentUser } from "./redux/features/authSlice";
import CategoryWrapper from "./components/CategoryWrapper";
import StripePaymentPage from "./components/StripePaymentPage";
import { fetchNotifications } from "./redux/features/notificationSlice";
import { jwtDecode } from "jwt-decode";

// App Component
function App() {
  const dispatch = useAppDispatch();




 

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  
    if (token) {
      try {
        // Decode the token to extract the role
        const decodedToken:any = jwtDecode(token);
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (roles && roles.includes("Admin")) {
          // If role is Admin, clear localStorage and log out
          localStorage.clear();
          dispatch(doLogout()); // Assuming a logoutUser action is defined
          return; // Exit early to prevent further execution
        }
      } catch (error) {
        console.error("Error decoding token", error);
        localStorage.clear();
        dispatch(doLogout()); // Log out if the token is invalid
        return;
      }
    }
  
    if (userId) {
      const intervalId = setInterval(() => {
        dispatch(fetchNotifications(userId));
      }, 5000); // Fetch notifications every 5 seconds
  
      dispatch(fetchCurrentUser());
  
      // Cleanup function to stop the interval
      return () => clearInterval(intervalId);
    }
  }, [dispatch]);
  
  

  return (
    <div className="flex flex-col min-h-screen"> {/* Apply flexbox and full screen height */}
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/product/:productID" element={<SingleProduct />} />
          <Route 
    path="/category/:categoryName" 
    element={<CategoryWrapper />} // Use a wrapper to get the categoryName from useParams and pass it as a prop
  />

          {/* Protected Routes */}
          <Route path="/wishlist" element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          <Route path="/sales" element={<ProtectedRoute />}>
            <Route path="/sales" element={<Sales />} />
          </Route>

          <Route path="/account" element={<ProtectedRoute />}>
            <Route path="/account" element={<Component />} />
          </Route>

          <Route path="/checkout" element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
           
          </Route>

          <Route path="/payment" element={<ProtectedRoute />}>
          <Route path="/payment" element={<StripePaymentPage />} />

           
          </Route>
        
        </Routes>
      </div>

      {/* Toast notifications */}
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Footer - This will stay at the bottom */}
      <Footer />
      
      {/* Additional Components */}
      <Cart />
      <DriftChat />
      <LoginModal />
      <ScrollToTopButton />
      <BannerPopup />
    </div>
  );
}

export default App;
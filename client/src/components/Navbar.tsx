import { FC, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setCartState } from "../redux/features/cartSlice";
import { setModalType, updateModal } from "../redux/features/authSlice";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaUser } from "react-icons/fa";
import CustomPopup from "./CustomPopup";
import { updateDarkMode } from "../redux/features/homeSlice";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { fetchProducts, setSearchTerm } from "../redux/features/productSlice";

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems || []);
const [searchTerm,set]=useState<string>('');
  // Accessing the length of the cartItems array safely
  const cartCount = cartItems.length;
  const username = useAppSelector((state) => state.authReducer.username);
  const isDarkMode = useAppSelector((state) => state.homeReducer.isDarkMode);
  const isAdmin = useAppSelector((state) => state.authReducer.isAdmin); // Assuming isAdmin is in authReducer
  const { requireAuth } = useAuth();

  
   // visibility
    
    const handleSearch = (e) => {
      const value = e.target.value;
   //   setSearchTerm(value);
      
        const timeoutId = setTimeout(() => {
          dispatch(setSearchTerm(value));
        }, 2500); // Pozivanje pretrage nakon 5 sekundi
  
        return () => clearTimeout(timeoutId); // Očisti timeout ako se searchTerm promeni pre 5 sekundi
      
      
    };
  const showCart = () => {
    requireAuth(() => dispatch(setCartState({ isOpen: true })));
  };
  const handle=()=>{

    dispatch(updateModal(true));
    dispatch(setModalType("login"))
  }

  return (
    <div className="py-4 bg-white dark:bg-slate-800 top-0 sticky z-10 shadow-lg font-karla">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold dark:text-white"
            data-test="main-logo"
          >
            JSTORE
          </Link>
          <div className="lg:flex hidden w-full max-w-[500px]">
            <input
              type="text"
              placeholder="Search for a product..."
              className="border-2 border-blue-500 px-6 py-2 w-full dark:text-white dark:bg-slate-800"
             
              onChange={handleSearch}
            />
            <div className="bg-blue-500 text-white text-[26px] grid place-items-center px-4">
              <BsSearch />
            </div>
          </div>
          <div className="flex gap-4 md:gap-8 items-center dark:text-white">
            <Link
              to="/products"
              className="text-xl font-bold"
              data-test="main-products"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-xl font-bold"
              data-test="main-categories"
            >
              Categories
            </Link>
            <div className="flex items-center gap-2">
              {username !== "" ? (
                <img
                  src="https://robohash.org/Terry.png?set=set4"
                  alt="avatar"
                  className="w-6"
                />
              ) : (
                <FaUser className="text-gray-500 text-2xl dark:text-white" />
              )}
              <div className="text-gray-500 text-2xl">
                {username !== "" ? (
                  <CustomPopup />
                ) : (
                  <span
                    className="cursor-pointer hover:opacity-85 dark:text-white"
                    onClick={() =>handle() 

                    }
                    data-test="login-btn"
                  >
                    Login
                  </span>
                )}
              </div>
            </div>
            {!isAdmin && ( // Only render the cart icon if isAdmin is false
              <div
                className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
                onClick={showCart}
                data-test="cart-btn"
              >
                <AiOutlineShoppingCart className="dark:text-white" />
                <div
                  className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center"
                  data-test="cart-item-count"
                >
                  {cartCount}
                </div>
              </div>
            )}
            <div
              onClick={() => {
                dispatch(updateDarkMode(!isDarkMode));
                document.body.classList.toggle("dark");
              }}
            >
              {isDarkMode ? (
                <MdOutlineLightMode className="cursor-pointer" size={30} />
              ) : (
                <MdOutlineDarkMode className="cursor-pointer" size={30} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

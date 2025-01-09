import { useState } from "react";
import { createOrder } from "../redux/features/orderSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";



import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const dispatch=useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.homeReducer.isDarkMode);
  const userDetails = useAppSelector((state) => state.authReducer.userDetails);
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);

  const[address,setAdress]=useState("");
  const[city,setCity]=useState("");
  const[zip,setZip]=useState("");
  const[country,setcountry]=useState("");
  const navigate=useNavigate();
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");


const totalAmount=cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  
const handle = () => {
  // Get the userId from the user or auth state, make sure it's a valid GUID (string)
  const userId = userDetails?.id ? userDetails.id : ""; // Replace with actual user GUID

  // Construct the shipping address using the user-entered data
  const shippingAddress = `${address || userDetails?.adress}, ${city || userDetails?.city}, ${zip || userDetails?.postalCode}, ${country || userDetails?.states}`;
  
  // Construct the orderData object
  const orderData = {
    customerName: `${firstName || userDetails?.firstName} ${lastName || userDetails?.lastName}`, // Use user input firstName and lastName, or fallback to userDetails
    shippingAddress, 
    orderDate: new Date().toISOString(), // Current date in ISO 8601 format
    orderStatusId: 1, // Example order status, replace as needed
    isPaid: false, // Set true if payment is done
    userId,
    CartItems: cartItems.map((item) => ({
      productId: item.cartItemId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
  };
  
  console.log(orderData); // Log the orderData to ensure everything is captured correctly
  
  // Dispatch the createOrder action with the orderData
  dispatch(createOrder(orderData));
  //toast.success("Your order has been confirmed", { duration: 3000 });
  navigate("/"); // Redirect to the home page or wherever you need
};


const handleCompletePurchase = () => {

  const userId = userDetails?.id ? userDetails.id : ""; // Replace with actual user GUID

  // Construct the shipping address using the user-entered data
  const shippingAddress = `${address || userDetails?.adress}, ${city || userDetails?.city}, ${zip || userDetails?.postalCode}, ${country || userDetails?.states}`;
   cartItems.map((item) => {console.log(item.title)});
  // Construct the orderData object
  const orderData = {
    customerName: `${firstName || userDetails?.firstName} ${lastName || userDetails?.lastName}`, // Use user input firstName and lastName, or fallback to userDetails
    shippingAddress, 
    orderDate: new Date().toISOString(), // Current date in ISO 8601 format
    orderStatusId: 1, // Example order status, replace as needed
    isPaid: false, // Set true if payment is done
    userId,
    CartItems: cartItems.map((item) => ({
      productId: item.cartItemId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
  };
  
  console.log(orderData);
  
  navigate("/payment", { state: { totalAmount,orderData} });
};
return (
    <div className={`font-[sans-serif] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen`}>
      <div className={`flex max-sm:flex-col gap-12 max-lg:gap-4 h-full ${isDarkMode ? 'bg-gray-800' : ''}`}>
        <div className={`sm:h-screen s'123 m:sticky sm:top-0 lg:min-w-[370px] sm:min-w-[300px] bg-gray-800`}>
          <div className="relative h-full">
            <div className="px-4 py-8 sm:overflow-auto sm:h-[calc(100vh-60px)]">
              <div className="space-y-4">
                {
                  cartItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-3 shrink-0 bg-gray-300 rounded-md">
                        <img src={item.thumbnail} className="w-full object-contain" alt={item.title} />
                      </div>
                      <div className="w-full">
                        <h3 className="text-base text-white">{item.title}</h3>
                        <ul className="text-xs text-gray-300 space-y-2 mt-2">
                          <li className="flex flex-wrap gap-4">
                            Price <span className="ml-auto">${item.price}</span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Quantity <span className="ml-auto">{item.quantity}</span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Total Price{" "}
                            <span className="ml-auto">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                ))}
                <div className="md:absolute md:left-0 md:bottom-0 w-full p-4 bg-gray-800">
                  <h4 className="flex flex-wrap gap-4 text-base text-white">
                    Total{" "}
                    <span className="ml-auto">
                      ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Form */}
       {/* Personal and Shipping Details */}
       <div className={`max-w-4xl w-full h-max rounded-md px-4 py-8 sticky top-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold text-gray-800">Complete your order</h2>
          <form className="mt-8">
            <div>
              <h3 className="text-base text-gray-800 mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={firstName || userDetails?.firstName || ""}
                    onChange={(e)=>setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={lastName ||userDetails?.lastName || ""}
                    onChange={(e)=>setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={userDetails?.email || ""}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone No."
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={userDetails?.phoneNumber  || ""}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Shipping Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Address Line"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={address ||userDetails?.adress || ""}
                    onChange={(e)=>{setAdress(e.target.value)}}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={city ||userDetails?.city || ""}
                    onChange={(e)=>{setCity(e.target.value)}}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={country ||userDetails?.states || ""}
                    onChange={(e)=>{setcountry(e.target.value)}}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} w-full text-sm rounded-md focus:outline-blue-600`}
                    value={zip || userDetails?.postalCode || ""}
                    onChange={(e)=>{setZip(e.target.value)}}
                  />
                </div>
              </div>
                {/* Other inputs */}
                <div className="flex gap-4 max-md:flex-col mt-8">
                <button
                  type="button"
                  className={`rounded-md px-6 py-3 w-full text-sm tracking-wide ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800'} max-md:order-1`}
               onClick={handle}
               >
                  Pay on Delivery
                </button>
                <button
                type="button"
                onClick={handleCompletePurchase}
                className={`rounded-md px-6 py-3 w-full text-sm tracking-wide ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
               Pay by Card
              </button>
              </div>
            </div>
          </form>
        </div>
      </div>

       {/* Stripe Payment Form */}
      
    
    </div>
  );
}

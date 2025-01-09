import { FC, FormEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, doRegister, editUser1, setEditUser, setModalType, updateModal, UserDetails } from "../redux/features/authSlice"; // Import `doRegister`
import { FaUnlock, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { updateProductQuantity } from "../redux/features/productSlice";
import { updateOrder } from "../redux/features/orderSlice";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Navigate, useNavigate } from "react-router-dom";


const LoginModal: FC = () => {
  const updatedProduct=useAppSelector((state)=>state.productReducer.updateProduct);
  const allProducts=useAppSelector(state=>state.productReducer.allProducts);
  const [thumbnail,setThumbnail]=useState<string[]>([]);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birhtDay, setBirthDate] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | "">("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();
  const [availabilityStatus, setAvailabilityStatus] = useState();
  const [discountPercentage, setDiscountPercentage] = useState();
  const [tags, setTags] = useState();
 
  
  
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);
  const modalType = useAppSelector((state) => state.authReducer.modalType);
  const user=useAppSelector((state)=>state.authReducer.user);
 const edituser=useAppSelector((state)=>state.authReducer.edituser);
 const thisOrder=useAppSelector((state)=>state.orderReducer.thisOrder);


  const [firstName1, setFirstName1] = useState(edituser?.firstName);
  const [lastName1, setLastName1] = useState(edituser?.lastName);
  const [address1, setAddress1] = useState(edituser?.adress);
  const [phoneNumber1, setPhoneNumber1] = useState(edituser?.phoneNumber);
  const [city1, setCity1] = useState(edituser?.city);
  const [postalCode1, setPostalCode1] = useState(edituser?.postalCode);
  const [state1, setState1] = useState(edituser?.states);
  const [count,setCount]=useState<number>();
  const editUser=useAppSelector((state)=>state.productReducer.editProduct);
  const editOrder=useAppSelector((state)=>state.orderReducer.thisOrder);
  const [status,setStatus]=useState(1);
  const [isPaid,setIsPaid]=useState(false);
  const navigate=useNavigate();



  const handleRegistration = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setError("");
    dispatch(setModalType("register"));
    dispatch(updateModal(true));
  };

  useEffect(() => {
  if (updatedProduct) {
    const status = updatedProduct.stock > 0 ? 'Available' : 'Not Available';
    setPrice(updatedProduct.price?.toString() || '');
    setStock(updatedProduct.stock?.toString() || '');
    setAvailabilityStatus(status);
    setDiscountPercentage(updatedProduct.discountPercentage?.toString() || '');
    setTags(updatedProduct.tags ? updatedProduct.tags.join(', ') : '');
  }

  //allProducts.find(p => p.title === item.title)?.thumbnail

}, [updatedProduct]);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName || !password || (modalType === "register" && !email)) {
      setError("Please fill all required fields.");
      return;
    }

    if (modalType === "register") {
      // Convert birthDate to Date object
      const date1 = new Date(birhtDay);

      // If date1 is an invalid date, show an error
      if (isNaN(date1.getTime())) {
        setError("Please provide a valid birth date.");
        return;
      }

      // Dispatch the registration action with the converted date
      dispatch(doRegister({
        firstName,
        lastName,
        email,
        password,
        address,
        phoneNumber,
        username: userName,
        birthDate: date1,
        age: calculateAge(birhtDay),
        city,
        postalCode,
        state,
      }));
      dispatch(updateModal(false));
      // Wait for registration success before closing the modal
      setError("");  // Reset error if form submission is successful
    } else if(modalType=="login") {
      dispatch(doLogin({ UserName: userName, Password: password }));
      dispatch(updateModal(false)); // Close modal immediately on login
    }
    else if(modalType=="update")
    {
      //dispatch(setEditUser(user));

      console.log("Ime "+edituser?.firstName)
      const userData: UserDetails = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        age: 30,
        city: city,
        postalCode: postalCode,
        state: state,
      };
    
      const userId = edituser?.userId; // The ID of the user you want to edit
      console.log("Id: " +userId);
     
        dispatch(editUser1({ userData, userId }));
      
          dispatch(updateModal(false)); // Close modal immediately after submitting
          setError(""); 
    }
    else if(modalType=="editproduct")
    {
      console.log("Ispis: "+editUser?.title);
      console.log("Quantity "+count);
      dispatch(updateProductQuantity({ id: editUser?.id, price,stock,availabilityStatus,discountPercentage,tags }));
      dispatch(updateModal(false));
    }
    else if(modalType=="editOrder")
    {
      dispatch(updateModal(false));

      const orderData = {
        orderStatusId: status,
        isPaid,
      };

      dispatch(updateOrder({ orderId:editOrder?.orderId, orderData }));
      console.log("Ispis: "+status+"Placeno: "+isPaid);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setBirthDate(date);
    // Automatically calculate age when the birthdate changes
  };

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    // Dekodiraj JWT token za dobijanje korisničkih podataka
    const decodedToken = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
    console.log("Decoded Token:", decodedToken);

    // Sačuvaj korisničke podatke u lokalnoj memoriji ili stanju aplikacije
    localStorage.setItem("user", JSON.stringify(decodedToken));

    alert(`Welcome, ${decodedToken.name}!`);
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failed:", error);
    alert("Login failed, please try again!");
  };




  if (open) {
    return (
      <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
        <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
          <RxCross1
            className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
            onClick={() => dispatch(updateModal(false))}
          />
          {modalType === "register" && (
            <>
              <div className="flex mb-2 space-x-2 justify-center items-center">
                <FaUserPlus />
                <h3 className="font-bold text-center text-2xl">Register</h3>
                <FaUserPlus />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <form onSubmit={submitForm} className="flex flex-col space-y-3">
                <input
                  type="text"
                  placeholder="First name"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Birth date"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={birhtDay}
                  onChange={handleBirthDateChange}  // Use the new date change handler
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <input
                  type="submit"
                  value="Register"
                  className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                />
              </form>
              <p className="text-center mt-1">
                Already have an account?{" "}
                <button
                  className="text-blue-500 cursor-pointer underline bg-transparent border-none"
                  onClick={() => dispatch(setModalType("login"))}
                >
                  Go to login
                </button>
              </p>
        
            </>
          )}
          {modalType === "login" && (
            <>
              <div className="flex mb-2 space-x-2 justify-center items-center">
                <FaUnlock />
                <h3 className="font-bold text-center text-2xl">Login</h3>
                <FaUnlock />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <form onSubmit={submitForm} className="flex flex-col space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your username here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Your password here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
                </div>
                <input
                  type="submit"
                  value="Login"
                  className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                />
              </form>
              <p className="text-center mt-1">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 cursor-pointer underline bg-transparent border-none"
                  onClick={handleRegistration}
                >
                  Register now
                </button>
                <GoogleOAuthProvider clientId="606006109146-abr54fa79sjsitvs543f2f015jvftbue.apps.googleusercontent.com">
      
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
    
    </GoogleOAuthProvider>
           
              </p>
              
            </>
          )}
          {modalType === "update" && (
            <>
             <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
                     <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
                       <RxCross1
                         className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
                         onClick={() => dispatch(updateModal(false))}
                       />
                       <div className="flex mb-2 space-x-2 justify-center items-center">
                         <FaUserEdit />
                         <h3 className="font-bold text-center text-2xl">Update User Info</h3>
                         <FaUserEdit />
                       </div>
                       {error && <p className="text-red-500 text-center">{error}</p>}
                       <form onSubmit={submitForm} className="flex flex-col space-y-3">
                         <input
                           type="text"
                           placeholder="First name"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={firstName1}
                           onChange={(e) => setFirstName1(e.target.value)}
                         />
                         <input
                           type="text"
                           placeholder="Last name"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={lastName1}
                           onChange={(e) => setLastName1(e.target.value)}
                         />
                         <input
                           type="text"
                           placeholder="Address"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={address1}
                           onChange={(e) => setAddress1(e.target.value)}
                         />
                         <input
                           type="text"
                           placeholder="Phone number"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={phoneNumber1}
                           onChange={(e) => setPhoneNumber1(e.target.value)}
                         />
                       
                         <input
                           type="text"
                           placeholder="City"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={city1}
                           onChange={(e) => setCity1(e.target.value)}
                         />
                         <input
                           type="text"
                           placeholder="Postal code"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={postalCode1}
                           onChange={(e) => setPostalCode1(e.target.value)}
                         />
                         <input
                           type="text"
                           placeholder="State"
                           className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                           value={state1 }
                           onChange={(e) => setState1(e.target.value)}
                         />
                       
                         <input
                           type="submit"
                           value="Update"
                           className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                         />
                       </form>
                     </div>
                   </div>
            </>
          )}
          {modalType === "editproduct" && (
            <>
        <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
  <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
    {/* Close Button */}
    <RxCross1
      className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
      onClick={() => dispatch(updateModal(false))}
    />
    
    {/* Header */}
    <div className="flex mb-4 space-x-2 justify-center items-center">
      <FaUserEdit />
      <h3 className="font-bold text-center text-2xl">Update Product Details</h3>
      <FaUserEdit />
    </div>
    
    {/* Error Message */}
    {error && <p className="text-red-500 text-center">{error}</p>}
    
    {/* Form */}
    <form onSubmit={submitForm} className="flex flex-col space-y-4">
      {/* Price Field */}
      <input
        type="number"
        placeholder="Price"
        step="0.01"
        className="border w-full border-black py-2 px-4 rounded dark:bg-slate-600"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* Stock Field */}
      <input
        type="number"
        placeholder="Stock"
        className="border w-full border-black py-2 px-4 rounded dark:bg-slate-600"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      {/* Availability Status Field */}
      <input
        type="text"
        placeholder="Availability Status"
        className="border w-full border-black py-2 px-4 rounded dark:bg-slate-600"
        value={availabilityStatus}
        onChange={(e) => setAvailabilityStatus(e.target.value)}
      />

      {/* Discount Percentage Field */}
      <input
        type="number"
        placeholder="Discount Percentage"
        step="0.01"
        className="border w-full border-black py-2 px-4 rounded dark:bg-slate-600"
        value={discountPercentage}
        onChange={(e) => setDiscountPercentage(e.target.value)}
      />

      {/* Tags Field */}
      <textarea
        placeholder="Tags (comma-separated)"
        className="border w-full border-black py-2 px-4 rounded dark:bg-slate-600"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      ></textarea>

      {/* Submit Button */}
      <input
        type="submit"
        value="Update"
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
      />
    </form>
  </div>
</div>


            </>
          )}
          {modalType === "editOrder" && (
             <>
             <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
                     <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
                       <RxCross1
                         className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
                         onClick={() => dispatch(updateModal(false))}
                       />
                       <div className="flex mb-2 space-x-2 justify-center items-center">
                         <FaUserEdit />
                         <h3 className="font-bold text-center text-2xl">Update Order Info</h3>
                         <FaUserEdit />
                       </div>
                       {error && <p className="text-red-500 text-center">{error}</p>}
                       <form onSubmit={submitForm} className="flex flex-col space-y-3">
                       <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Order status</h3>
<ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <div className="flex items-center ps-3">
            <input  onChange={()=>{setStatus(1)}} id="list-radio-processing" type="radio" name="orderStatus" value="1" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label htmlFor="list-radio-processing" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Processing</label>
        </div>
    </li>
    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <div className="flex items-center ps-3">
            <input  onChange={()=>{setStatus(2)}} id="list-radio-shipped" type="radio" name="orderStatus" value="2" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label htmlFor="list-radio-shipped" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Shipped</label>
        </div>
    </li>
    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <div className="flex items-center ps-3">
            <input   onChange={()=>{setStatus(3)}} id="list-radio-delivered" type="radio" name="orderStatus" value="3" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label htmlFor="list-radio-delivered" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Delivered</label>
        </div>
    </li>
</ul>

<div className="flex items-center mb-4">
    <input  onChange={()=>{setIsPaid(!editOrder?.isPaid)}} id="default-checkbox" type="checkbox" value={editOrder?.orderStatus} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">is Paid</label>
</div>

                         
                       
                         <input
                           type="submit"
                           value="Update"
                           className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                         />
                       </form>
                     </div>
                   </div>
            </>
          )}
          {
            modalType === "showOrder" && (
              <>
              <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
  <div className="relative border shadow-lg rounded-lg p-8 bg-white max-w-3xl w-full z-40 dark:bg-gray-800 dark:text-white">
    {/* Close Button */}
    <button
      className="absolute right-5 top-5 text-red-500 hover:text-red-700"
      onClick={() => dispatch(updateModal(false))}
    >
      ✕
    </button>
    <h4 className="text-lg font-bold mt-6">Order Items</h4>
<div className="mt-3 overflow-auto max-h-60 border border-gray-300 rounded-md">
<table className="min-w-full divide-y divide-gray-200">
  <thead>
    <tr className="bg-gray-100 dark:bg-gray-700">
      <th className="px-4 py-2 text-left text-sm font-medium">Image</th>
      <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
      <th className="px-4 py-2 text-left text-sm font-medium">Quantity</th>
      <th className="px-4 py-2 text-left text-sm font-medium">Unit Price</th>
      <th className="px-4 py-2 text-left text-sm font-medium">Total Price</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {thisOrder?.items?.map((item) => (
      <tr key={item.orderItemId} className="hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="px-4 py-2">
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-16 h-16 object-cover rounded" 
          />
        </td>
        <td className="px-4 py-2">{item.title}</td>
        <td className="px-4 py-2">{item.quantity}</td>
        <td className="px-4 py-2">{`$${item.unitPrice.toFixed(2)}`}</td>
        <td className="px-4 py-2">{`$${item.totalPrice.toFixed(2)}`}</td>
      </tr>
    ))}
  </tbody>
</table>

</div>

 

    {/* Modal Footer */}
    <div className="mt-5 flex justify-end">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={() => dispatch(updateModal(false))}
      >
        Close
      </button>
    </div>
  </div>
</div>
              </>
            )
          }
        </div>
      </div>
    );
  }

  return null;
};

export default LoginModal;
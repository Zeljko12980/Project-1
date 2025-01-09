"use client";
import { ChangeEvent, FormEvent, Profiler, useEffect, useRef, useState } from "react";
import { Sidebar } from "flowbite-react";
import NotificationConnector from "./../../signlar.ts"; 
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import LineChart from "../components/LineChart";
import { deleteUser, doRegisterAdmin, editUser1, getAllUsers, setEditUser, setModalType, setUser, updateModal, UserDetails } from "../redux/features/authSlice";
import { addProduct, deleteProduct, fetchPaginatedProducts, fetchProducts, setEditProduct, setUpdateProduct } from "../redux/features/productSlice";
import { RiCloseCircleLine, RiDeleteBin6Line} from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { deleteOrder, fetchAllOrders, setOrder } from "../redux/features/orderSlice";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { jwtDecode } from "jwt-decode";

import signalR, { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { addNotification, deleteNotification, fetchNotifications, markAllNotificationsAsRead, markAsRead, markNotificationAsRead } from "../redux/features/notificationSlice.ts";
import { AiOutlineEye } from "react-icons/ai";

function OrderList() {
  const dispatch=useAppDispatch();
  const orders=useAppSelector((state)=>state.orderReducer.orders);

  const totalProducts = useAppSelector((state) => state.orderReducer.totalOrders); // Assuming you have total count
  const productsPerPage =5; // You can change this based on your design or allow dynamic input
  const [currentPage, setCurrentPage] = useState(1);
  //let editproduct=useAppSelector((state)=>state.productReducer.editProduct);
  
  

  // Funkcija za promenu selektovanih brandova
 
  useEffect(() => {
  
    dispatch(fetchAllOrders({pageNumber:currentPage,pageSize:5}));
   // dispatch(fetchPaginatedProducts({pageNumber:currentPage,pageSize:5}));

   orders.map((i)=>{
    i.items.map((j)=>{
      console.log("Order: "+j.thumbnail);
    })
   })
    
  }, [dispatch, currentPage, productsPerPage]);

  const [searchTerm, setSearchTerm] = useState('');
  //const [showSales, setShowSales] = useState(false);
//const navigate=useNavigate();
  // Function to toggle dropdown visibility
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchAllOrders({ pageNumber: 1, pageSize: 5, searchTerm }));
      }, 2500); // Pozivanje pretrage nakon 5 sekundi

      return () => clearTimeout(timeoutId); // Očisti timeout ako se searchTerm promeni pre 5 sekundi
    }
    
  };

  const handleDelete = (id) => {
    
    
    dispatch(deleteOrder({ id }));
    dispatch(fetchAllOrders({pageNumber:currentPage,pageSize:5}));
    // navigate('/account#');
    };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 ">
    <div className="px-4 mx-auto  max-w-screen-x1 lg:px-12">
    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required=""
                            value={searchTerm}
                            onChange={handleSearch}
                            
                            />
                        </div>
                    </form>
                </div>
                
                 {/* Conditionally render Sales component */}  
                       
      </div>
                 
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">About order</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Date</th>
                            <th scope="col" className="px-4 py-3">Is Paid</th>
                            <th scope="col" className="px-4 py-3">Total count</th>
                            <th scope="col" className="px-4 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
            <tbody>
              {orders.map((product) => (
                <tr key={product.orderId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                   <th scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   
                   {product.customerName} - {product.shippingAddress}</th>
                 <td className="px-4 py-3">{product.orderStatus}</td>
                            <td className="px-4 py-3">{product.orderDate}</td>
                            <td className="px-4 py-3"> &nbsp;&nbsp;{product.isPaid===true ? "Yes": "No"}</td>

                            <td className="px-4 py-3">${product.totalOrderPrice}</td>
                            <td className="px-4 py-3 flex m-1 items-center justify-end">
                              {product.orderStatus==="Processing" && (
                            <RiCloseCircleLine
                           
  className={`text-red-500 cursor-pointer text-2xl hover:text-red-600 ${product.orderStatus !== "Processing" ? 'opacity-50 cursor-not-allowed' : ''}`}
  onClick={() => handleDelete(Number(product.orderId))}
/>
)}

<AiOutlineEye 
  className="text-blue-500 cursor-pointer text-2xl hover:text-blue-600 ml-2" 
  onClick={() => {
   dispatch(setModalType("showOrder"));
    dispatch(updateModal(true));
    dispatch(setOrder(product));
   
    product.items.map((i)=>{
      console.log("Slika je: "+i.totalPrice)
    })
   //alert("Show")
  }} 
/>

  
</td>


                         
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginacija */}
        <nav
      className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentPage * 5 - 4}-{Math.min(currentPage * 5, totalProducts)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalProducts}
        </span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                page === currentPage
                  ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
      </div>
      </div>
    </section>
  );
}

interface Notification
{
  id: number; // Jedinstveni identifikator obaveštenja
  userId: string; // ID korisnika kojem je obaveštenje upućeno
  message: string; // Sadržaj obaveštenja
  createdAt: Date; // Datum i vreme kada je obaveštenje kreirano
  isRead: boolean;
}

function Inbox() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifyReducer.notifications);
  const count=useAppSelector((state)=>state.notifyReducer.count);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);


  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markNotificationAsRead(notificationId)); // Dispatch an action to mark a notification as read
  };
  
  const handleMarkAllAsRead = () => {
    const userId=localStorage.getItem("userId");
    dispatch(markAllNotificationsAsRead(userId));
  };
  
  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Slice the notifications array to show only the current page's items
  const currentNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const userId = localStorage.getItem("userId"); // Pribavljamo userId iz localStorage

  useEffect(() => {
    if (!userId) return; // Ako nema userId, ne radimo ništa

    // Dohvata notifikacije sa servera
    dispatch(fetchNotifications(userId));

    // Kreiramo SignalR konekciju
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5157/notifications") // Zameni sa tvojim backend URL-om
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("SignalR connected");

        // Slušamo događaj `ReceiveNotification`
        newConnection.on("ReceiveNotification", (notification: Notification) => {
          if (notification.userId.toString() === userId) {
            console.log("Received notification:", notification.message);
            dispatch(addNotification(notification)); // Dodaj novu notifikaciju u Redux stanje
          }
        });
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
      });

    // Cleanup kada se komponenta unmountuje
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [userId, dispatch]);


   useEffect(()=>{
    setTimeout(() => {
      console.log("Ucitava");
      dispatch(fetchNotifications(localStorage.getItem("userId")!));
    }, 1000);
  })

  return (
    <div>
    <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold">Notifications</h2>
  {count>0 &&(
  <button
    onClick={handleMarkAllAsRead}
    className="text-sm text-blue-500 hover:text-blue-700 px-3 py-1 border border-blue-500 rounded-lg"
  >
    Mark All as Read
  </button>)}
</div>
<ul className="space-y-4">
  {currentNotifications.map((notification) => (
    <li
      key={notification.id}
      className={`p-4 ${notification.isRead ? 'bg-gray-300' : 'bg-blue-600'} text-white rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300 flex justify-between items-center`}
    >
      <div>
        <p className="text-sm">{notification.message}</p>
        <span className="text-xs text-blue-200">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {!notification.isRead && (
          <button
            onClick={() => handleMarkAsRead(notification.id)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={() => handleDelete(notification.id)}
          className="ml-4 text-xl text-red-500 hover:text-red-700"
        >
          ✖
        </button>
      </div>
    </li>
  ))}
</ul>


    {/* Pagination Controls */}
    <nav className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4">
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentPage * 5 - 4}-{Math.min(currentPage * 5, notifications.length)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {notifications.length}
        </span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                page === currentPage
                  ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </div>
  );
}


function Products() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.productReducer.paginatedProducts);
  const totalProducts = useAppSelector((state) => state.productReducer.totalProducts); // Assuming you have total count
  const productsPerPage =5; // You can change this based on your design or allow dynamic input
  const [currentPage, setCurrentPage] = useState(1);
  let editproduct=useAppSelector((state)=>state.productReducer.editProduct);
  
  

  // Funkcija za promenu selektovanih brandova
 
  useEffect(() => {
  
    dispatch(fetchProducts());
    dispatch(fetchPaginatedProducts({pageNumber:currentPage,pageSize:5}));
    
  }, [dispatch, currentPage, productsPerPage]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSales, setShowSales] = useState(false);
const navigate=useNavigate();
  // Function to toggle dropdown visibility
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchPaginatedProducts({ pageNumber: 1, pageSize: 5, searchTerm }));
      }, 2500); // Pozivanje pretrage nakon 5 sekundi

      return () => clearTimeout(timeoutId); // Očisti timeout ako se searchTerm promeni pre 5 sekundi
    }
    
  };

  const handleDelete = (id) => {
    
    
    dispatch(deleteProduct({ id }));
    navigate('/account#');
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 ">
    <div className="px-4 mx-auto max-w-screen-2xl lg:px-12">
    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required=""
                            value={searchTerm}
                            onChange={handleSearch}
                            
                            />
                        </div>
                    </form>
                </div>
                
                 {/* Conditionally render Sales component */}  
                       
      </div>
                 
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">Product name</th>
                            <th scope="col" className="px-4 py-3">Category</th>
                            <th scope="col" className="px-4 py-3">Brand</th>
                            <th scope="col" className="px-4 py-3">Quantity</th>
                            <th scope="col" className="px-4 py-3">Price</th>
                            <th scope="col" className="px-4 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                   <th scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   <img src={product.thumbnail} alt={product.title} className="w-auto h-8 mr-3"/>
                    {product.title}</th>
                 <td className="px-4 py-3">{product.category}</td>
                            <td className="px-4 py-3">{product.brand}</td>
                            <td className="px-4 py-3"> &nbsp;&nbsp;{product.stock}</td>

                            <td className="px-4 py-3">${product.price}</td>
                            <td className="px-4 py-3 flex m-1 items-center justify-end">
  <CiEdit className="text-red-500 cursor-pointer text-2xl hover:text-red-600 mr-2" onClick={()=>{
      dispatch(setModalType("editproduct"));
      dispatch(updateModal(true));
      dispatch(setEditProduct(product))
      dispatch(setUpdateProduct(product))
      
  }} />
  <RiDeleteBin6Line className="text-red-500 cursor-pointer text-2xl hover:text-red-600" onClick={()=>{handleDelete((Number(product.id)))}} />
</td>


                         
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginacija */}
        <nav
      className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentPage * 5 - 4}-{Math.min(currentPage * 5, totalProducts)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalProducts}
        </span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                page === currentPage
                  ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
      </div>
      </div>
    </section>
  );
}
export function Sales() {
  const dispatch=useAppDispatch();
  const [product, setProduct] = useState({
    Title: "",
    Description: "",
    Category: "",
    Price: "",
    DiscountPercentage: "",
    Rating: "",
    Stock: "",
    Tags: [],
    Brand: "",
    Sku: "",
    Weight: "",
    Dimensions: {
      Width: "",
      Height: "",
      Depth: "",
    },
    WarrantyInformation: "",
    ShippingInformation: "",
    AvailabilityStatus: "In Stock",
    ReturnPolicy: "",
    MinimumOrderQuantity: "",
    Images: [],
    Thumbnail: "",
    Barcode: "",
    QrCode: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("Dimensions.")) {
      const dimensionKey = name.split(".")[1];
      setProduct((prev) => ({
        ...prev,
        Dimensions: { ...prev.Dimensions, [dimensionKey]: value },
      }));
    } else if (name === "Tags") {
      setProduct((prev) => ({
        ...prev,
        Tags: value.split(","),
      }));
    } else if (name === "Images") {
      setProduct((prev) => ({
        ...prev,
        Images: value.split(","), // Razdvaja URLs po zarezima i čini niz
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(product.Barcode!=="")
    {
    try {
       dispatch(addProduct({productDTO:product}));
      alert("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product: ", error);
    }
  }
  else{
    console.log(1);
  }
    // Ovde možete dodati logiku za slanje podataka na backend ili API
  };

  return (
  
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <form onSubmit={handleSubmit}>
          {currentPage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="Title"
                placeholder="Title"
                value={product.Title}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="Description"
                placeholder="Description"
                value={product.Description}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="Category"
                placeholder="Category"
                value={product.Category}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="Price"
                placeholder="Price"
                value={product.Price}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="DiscountPercentage"
                placeholder="Discount Percentage"
                value={product.DiscountPercentage}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="url"
                name="Images"
                placeholder="Images"
                value={product.Images.join(',')}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="Stock"
                placeholder="Stock"
                value={product.Stock}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="Tags"
                placeholder="Tags (comma-separated)"
                value={product.Tags.join(',')}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>
          )}
          {currentPage === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="Brand"
                placeholder="Brand"
                value={product.Brand}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="url"
                name="QrCode"
                placeholder="QR Code URL"
                value={product.QrCode}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="Weight"
                placeholder="Weight"
                value={product.Weight}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="Dimensions.Width"
                placeholder="Width"
                value={product.Dimensions.Width}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="Dimensions.Height"
                placeholder="Height"
                value={product.Dimensions.Height}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="Dimensions.Depth"
                placeholder="Depth"
                value={product.Dimensions.Depth}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="WarrantyInformation"
                placeholder="Warranty Information"
                value={product.WarrantyInformation}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="ShippingInformation"
                placeholder="Shipping Information"
                value={product.ShippingInformation}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="ReturnPolicy"
                placeholder="Return Policy"
                value={product.ReturnPolicy}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="MinimumOrderQuantity"
                placeholder="Minimum Order Quantity"
                value={product.MinimumOrderQuantity}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="url"
                name="Thumbnail"
                placeholder="Thumbnail URL"
                value={product.Thumbnail}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="Barcode"
                placeholder="Barcode"
                value={product.Barcode}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>
          )}
          <div className="flex justify-between mt-4">
            {currentPage > 1 && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
            )}
            {currentPage < 2 ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    )
}



function Refunds() {
 const dispatch=useAppDispatch();
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
  const navigate=useNavigate();

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      const date1 = new Date(birhtDay);
    
          // If date1 is an invalid date, show an error
          if (isNaN(date1.getTime())) {
            setError("Please provide a valid birth date.");
            return;
          }
    
          // Dispatch the registration action with the converted date
          dispatch(doRegisterAdmin({
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
          navigate("/");
          // Wait for registration success before closing the modal
          setError("");

  }

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

  return (
       <>
                 <div className="flex mb-2 space-x-2 justify-center items-center">
  <FaUserPlus />
  <h3 className="font-bold text-center text-2xl">Register</h3>
  <FaUserPlus />
</div>
{error && <p className="text-red-500 text-center">{error}</p>}
<form onSubmit={submitForm} className="flex flex-col space-y-3 max-w-lg mx-auto">
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

 </>
  );
}

function Shipping() {
  const dispatch=useAppDispatch();
  const orders=useAppSelector((state)=>state.orderReducer.orders);

  const totalProducts = useAppSelector((state) => state.orderReducer.totalOrders); // Assuming you have total count
  const productsPerPage =5; // You can change this based on your design or allow dynamic input
  const [currentPage, setCurrentPage] = useState(1);
  //let editproduct=useAppSelector((state)=>state.productReducer.editProduct);
  
  

  // Funkcija za promenu selektovanih brandova
 
  useEffect(() => {
  
    dispatch(fetchAllOrders({pageNumber:currentPage,pageSize:5}));
   // dispatch(fetchPaginatedProducts({pageNumber:currentPage,pageSize:5}));
    
  }, [dispatch, currentPage, productsPerPage]);

  const [searchTerm, setSearchTerm] = useState('');
  //const [showSales, setShowSales] = useState(false);
//const navigate=useNavigate();
  // Function to toggle dropdown visibility
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchAllOrders({ pageNumber: 1, pageSize: 5, searchTerm }));
      }, 2500); // Pozivanje pretrage nakon 5 sekundi

      return () => clearTimeout(timeoutId); // Očisti timeout ako se searchTerm promeni pre 5 sekundi
    }
    
  };

  const handleDelete = (id) => {
    
    
  dispatch(deleteOrder({ id }));
  dispatch(fetchAllOrders({pageNumber:currentPage,pageSize:5}));
  // navigate('/account#');
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 ">
    <div className="px-4 mx-auto  max-w-screen-x1 lg:px-12">
    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required=""
                            value={searchTerm}
                            onChange={handleSearch}
                            
                            />
                        </div>
                    </form>
                </div>
                
                 {/* Conditionally render Sales component */}  
                       
      </div>
                 
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">About order</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Date</th>
                            <th scope="col" className="px-4 py-3">Is Paid</th>
                            <th scope="col" className="px-4 py-3">Total count</th>
                            <th scope="col" className="px-4 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
            <tbody>
              {orders.map((product) => (
                <tr key={product.orderId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                   <th scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   
                   {product.customerName} - {product.shippingAddress}</th>
                 <td className="px-4 py-3">{product.orderStatus}</td>
                            <td className="px-4 py-3">{product.orderDate}</td>
                            <td className="px-4 py-3"> &nbsp;&nbsp;{product.isPaid===true ? "Yes": "No"}</td>

                            <td className="px-4 py-3">${product.totalOrderPrice}</td>
                            <td className="px-4 py-3 flex m-1 items-center justify-end">
                            <CiEdit 
  className="text-red-500 cursor-pointer text-2xl hover:text-red-600 mr-2" 
  onClick={() => {
    dispatch(setModalType("editOrder"));
    dispatch(updateModal(true));
    dispatch(setOrder(product));
  }} 
/>

<RiDeleteBin6Line 
  className="text-red-500 cursor-pointer text-2xl hover:text-red-600" 
  onClick={() => {
    handleDelete(Number(product.orderId));
  }} 
/>

<AiOutlineEye 
  className="text-blue-500 cursor-pointer text-2xl hover:text-blue-600 ml-2" 
  onClick={() => {
   dispatch(setModalType("showOrder"));
    dispatch(updateModal(true));
    dispatch(setOrder(product));
   //alert("Show")
  }} 
/>

</td>


                         
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginacija */}
        <nav
      className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentPage * 5 - 4}-{Math.min(currentPage * 5, totalProducts)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalProducts}
        </span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                page === currentPage
                  ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
      </div>
      </div>
    </section>
  );
}

function Users() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.authReducer.users);
  const userDetails=useAppSelector((state)=>state.authReducer.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleRemove = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  const handleModal=()=>{
dispatch(updateModal(true));
dispatch(setModalType("update"));
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-10">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              User Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr
              key={user.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-${user.id}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`checkbox-${user.username}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {user.username}
              </th>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.roles}</td>
              <td className="px-6 py-4">{user.states ? "Active" : "Inactive"}</td>
              <td className="flex items-center px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  onClick={(e) => {
                    e.preventDefault(); // Sprečava podrazumevano ponašanje linka
                    dispatch(setEditUser(user));
                    handleModal(); // Poziva funkciju za brisanje
                  }}
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                  onClick={(e) => {
                    e.preventDefault(); // Sprečava podrazumevano ponašanje linka
                    handleRemove(user.userId); // Poziva funkciju za brisanje
                  }}
                >
                  Remove
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Profile()
{
 const dispatch=useAppDispatch();
const edituser=useAppSelector((state)=>state.authReducer.userDetails);



 



  const [firstName, setFirstName] = useState(edituser?.firstName);
  const [lastName, setLastName] = useState(edituser?.lastName);
  const [address, setAddress] = useState(edituser?.adress);
  const [phoneNumber, setPhoneNumber] = useState(edituser?.phoneNumber);
  const [city, setCity] = useState(edituser?.city);
  const [postalCode, setPostalCode] = useState(edituser?.postalCode);
  const [state, setState] = useState(edituser?.states);
  const [birhtDay, setBirthDay] = useState<string>("");
  const navigate=useNavigate();
  const userDetails=useAppSelector((state)=>state.authReducer.userDetails);

 

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
 e.preventDefault();
    const userData:UserDetails={
            firstName: firstName,
            lastName: lastName,
            address: address,
            phoneNumber: phoneNumber,
            age: calculateAge(birhtDay),
            city: city,
            postalCode: postalCode,
            state: state,
          };
        
          const userId = localStorage.getItem("userId") // The ID of the user you want to edit
        
          console.log("User data"+userData.age);
          console.log("User data"+userId);
         
           dispatch(editUser1({ userData, userId }));
           navigate("/");
           
  }
  function handleBirthDateChange(e: ChangeEvent<HTMLInputElement>): void {
    const date = e.target.value;
    setBirthDay(date);
  }

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

  return(
    <>
                 <div className="flex mb-2 space-x-2 justify-center items-center">
  <FaUserPlus />
  <h3 className="font-bold text-center text-2xl">Update</h3>
  <FaUserPlus />
</div>

<form onSubmit={submitForm} className="flex flex-col space-y-3 max-w-lg mx-auto">
  <input
    type="text"
    placeholder="First name"
    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
    value={firstName || userDetails?.firstName || ""}
    onChange={(e) => setFirstName(e.target.value)}
  />
  <input
    type="text"
    placeholder="Last name"
    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
    value={lastName|| userDetails?.lastName || ""}
    onChange={(e) => setLastName(e.target.value)}
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
    value={phoneNumber|| userDetails?.phoneNumber || ""}
    onChange={(e) => setPhoneNumber(e.target.value)}
  />
  <input
    type="text"
    placeholder="City"
    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
    value={city|| userDetails?.city || ""}
    onChange={(e) => setCity(e.target.value)}
  />
  <input
    type="text"
    placeholder="Postal code"
    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
    value={postalCode|| userDetails?.postalCode || ""}
    onChange={(e) => setPostalCode(e.target.value)}
  />
  <input
    type="text"
    placeholder="Address"
    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
    value={address || userDetails?.adress || ""}
    onChange={(e) => setAddress(e.target.value)}
  />
  <input
    type="text"
    placeholder="State"
    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
    value={state|| userDetails?.states || ""}
    onChange={(e) => setState(e.target.value)}
  />
  <input
    type="submit"
    value="Update"
    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
  />
</form>

 </>
  );
}

export function Component() {
  const dispatch=useAppDispatch();
  const userDetails = useAppSelector((state) => state.authReducer.userDetails);
  const count=useAppSelector((state)=>state.notifyReducer.count);
  // Determine user roles
  const isAdmin = userDetails?.roles?.includes("Admin");
  const isUser = userDetails?.roles?.includes("User");


  // State for managing the active content
  const [activeContent, setActiveContent] = useState("dashboard");

 

  
  // Function to render content based on active section
  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <LineChart />;
      case "orders":
        return <OrderList />;
      case "inbox":
        return <Inbox />;
      case "products":
        return <Products />;
      case "sales":
        return <Sales />;
      case "refunds":
        return <Refunds />;
      case "shipping":
        return <Shipping />;
      case "users":
        return <Users />;
        case "profile":
          return <Profile />;
      default:
        return <div className="p-4">Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className="h-full" aria-label="Sidebar with multi-level dropdown example">
        <Sidebar.Items>
          <p className="p-4 font-bold">
            Welcome back, {userDetails?.firstName + " " + userDetails?.lastName}!
          </p>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie} onClick={() => setActiveContent("dashboard")}>
              Dashboard
            </Sidebar.Item>

            {/* E-commerce section for Admins */}
            {isAdmin && (
              <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
                <Sidebar.Item href="#" onClick={() => setActiveContent("products")}>
                  Products
                </Sidebar.Item>
                <Sidebar.Item href="#" onClick={() => setActiveContent("sales")}>
                  Add new product
                </Sidebar.Item>
                <Sidebar.Item href="#" onClick={() => setActiveContent("refunds")}>
                  Add new Admin
                </Sidebar.Item>
                <Sidebar.Item href="#" onClick={() => setActiveContent("shipping")}>
                  Orders
                </Sidebar.Item>
              </Sidebar.Collapse>
            )}

            {/* Users section for Admins */}
            {isAdmin && (
              <>
              <Sidebar.Item href="#" icon={HiUser} onClick={() => setActiveContent("users")}>
                Users
              </Sidebar.Item>
                  <Sidebar.Item href="#" icon={HiInbox} onClick={() => setActiveContent("inbox")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>Inbox</span>
                    {count > 0 && (
                      <span
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                </Sidebar.Item>
                </>
            )}

            {/* For User: My Orders instead of Products */}
            {isUser && (
              <Sidebar.Item href="#" icon={HiShoppingBag} onClick={() => setActiveContent("orders")}>
                My Orders
              </Sidebar.Item>
            )}

            {/* Common options */}
            {isUser && (
              <>
            <Sidebar.Item href="#" icon={HiInbox} onClick={() => setActiveContent("inbox")}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Inbox</span>
        {count > 0 && (
          <span
            style={{
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {count}
          </span>
        )}
      </div>
    </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUser} onClick={() => setActiveContent("profile")}>
               Edit profile
            </Sidebar.Item>
            </>
            )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-800">
        {renderContent()}
      </main>
    </div>
  );
}



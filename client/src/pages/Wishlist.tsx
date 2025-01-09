import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";

import { useAppDispatch } from "../redux/store";
import { fetchWishlist, removeFromWishlist } from "../redux/features/wishSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loading from "../components/Loading";

const Wishlist: FC = () => {
  const dispatch=useAppDispatch();
 const wishlist=useAppSelector((state)=>state.wishReducer.wishlist);
 const loading=useAppSelector((state)=>state.wishReducer.loading);

  const totalProducts = useAppSelector((state) => state.wishReducer.totalProducts); // Assuming you have total count
  const productsPerPage =5; // You can change this based on your design or allow dynamic input
  const [currentPage, setCurrentPage] = useState(1);
const userId=localStorage.getItem("userId");




useEffect(() => {
  
  window.scroll(0,0);
    dispatch(fetchWishlist({pageNumber:currentPage,pageSize:5}));
   // dispatch(fetchPaginatedProducts({pageNumber:currentPage,pageSize:5}));

   wishlist?.map(x=>{
    console.log("Ispis"+x.title);
   })
    
  }, [dispatch, currentPage, productsPerPage]);


   const [searchTerm, setSearchTerm] = useState('');
 const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchWishlist({ pageNumber: 1, pageSize: 5, searchTerm }));
      }, 2500); // Pozivanje pretrage nakon 5 sekundi

      return () => clearTimeout(timeoutId); // Očisti timeout ako se searchTerm promeni pre 5 sekundi
    }
    
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  function handleDelete(id: number) {
   
    const userId=localStorage.getItem("userId");
 
    dispatch(removeFromWishlist({userId,productId:id}));
    
   dispatch(fetchWishlist({pageNumber:currentPage,pageSize:5}));
  }

  if(loading) return <Loading/>;
return (
  <div className="container mx-auto font-karla min-h-[83vh]">
  {wishlist?.length  ? (
    
 <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
 <div className="px-4 mx-auto max-w-screen-2xl lg:px-12">
   <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
     <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
       <div className="w-full md:w-1/2">
         <form className="flex items-center">
           <label htmlFor="simple-search" className="sr-only">Search</label>
           <div className="relative w-full">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
               </svg>
             </div>
             <input 
               type="text" 
               id="simple-search" 
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
               placeholder="Search" 
               required
               value={searchTerm}
               onChange={handleSearch}
             />
           </div>
         </form>
       </div>

       {/* Conditionally render Sales component */}
       {/* You can add a condition to show a specific component here */}
       { /* Example: if (isSalesActive) { <SalesComponent /> } */}
     </div>

     <div className="overflow-x-auto">
       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
           <tr>
             <th scope="col" className="px-4 py-3">Product name</th>
             <th scope="col" className="px-4 py-3">Category</th>
             <th scope="col" className="px-4 py-3">Brand</th>
             <th scope="col" className="px-4 py-3">Rating</th>
             <th scope="col" className="px-4 py-3">Price</th>
             <th scope="col" className="px-4 py-3">
               <span className="sr-only">Actions</span>
             </th>
           </tr>
         </thead>
         <tbody>
           {wishlist?.map((product) => (
             <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
               <th scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                 <img src={product.thumbnail} alt={product.title} className="w-auto h-8 mr-3" />
                 {product.title}
               </th>
               <td className="px-4 py-3">{product.category}</td>
               <td className="px-4 py-3">{product.brand}</td>
               <td className="px-4 py-3"> &nbsp;&nbsp;{product.rating.toFixed(2)}</td>
               <td className="px-4 py-3">${product.price}</td>
               <td className="px-4 py-3 flex m-1 items-center justify-end">
                 <RiDeleteBin6Line 
                   className="text-red-500 cursor-pointer text-2xl hover:text-red-600"
                   onClick={() => handleDelete(Number(product.id))}
                 />
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {/* Pagination */}
     <nav className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
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
               <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
               <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
             </svg>
           </button>
         </li>
       </ul>
     </nav>
   </div>
 </div>
</section>

  ) : (
    <div className="flex flex-col justify-center items-center p-8">
      <img src="/emptyCart.jpg" className="w-60" alt="empty" />
      <p className="text-center text-xl font-semibold my-2 dark:text-white">
        Your wishlist is empty
      </p>
    </div>
  )}
</div>

  );
};

export default Wishlist;

import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks"; // Import hooks
import { fetchCategories } from "../redux/features/productSlice"; // Import the async thunk
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

const AllCategories: FC = () => {
  const dispatch = useAppDispatch();

  // Access categories from Redux state
  const allCategories = useAppSelector((state) => state.productReducer.categories);
  const loading=useAppSelector((state)=>state.productReducer.loading);



  useEffect(() => {
    // Dispatch the fetchCategories thunk to load categories from the API
    if (allCategories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [allCategories, dispatch]);

   if (loading) {
    return <Loading/>;
  }
  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <span className="text-lg dark:text-white">Categories</span>
      <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 my-2">
        {allCategories &&
          allCategories.map((category) => (
            <div
              key={category}
              className="bg-gray-100 dark:bg-slate-600 dark:text-white px-4 py-4 font-karla mr-2 mb-2"
            >
              <div className="text-lg">{category}</div>
              <Link
                to={{ pathname: `/category/${category}` }}
                className="hover:underline text-blue-500"
              >
                View products
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllCategories;

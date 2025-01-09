import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks"; // Import hooks
import { fetchProducts } from "../redux/features/productSlice"; // Import the async thunk
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import Loading from "../components/Loading";

const AllProducts: FC = () => {
  const dispatch = useAppDispatch();
  const sortRef = useRef<HTMLSelectElement>(null);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const searchTerm=useAppSelector((state)=>state.productReducer.searchTerm);
  
  const { allProducts, loading, error } = useAppSelector(
    (state) => state.productReducer
  );

  useEffect(() => {
    // Dispatch fetchProducts when the component mounts
    if(searchTerm)
    {
    dispatch(fetchProducts({searchTerm}));
    window.scrollTo(0, 0); // Pomera stranicu na vrh (0, 0)
    console.log("Prvi");
    }
    else
    {
      dispatch(fetchProducts());
      window.scrollTo(0, 0);
      console.log("Drugi");
    }

  }, [dispatch]);

  useEffect(() => {
    // Sync the current products with the Redux store
    setCurrentProducts(allProducts);
  }, [allProducts]);

  const sortProducts = (sortValue: string) => {
    if (sortValue === "asc") {
      setCurrentProducts(
        [...currentProducts].sort((a, b) => {
          const aPrice =
            a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
          const bPrice =
            b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
          return aPrice - bPrice;
        })
      );
    } else if (sortValue === "desc") {
      setCurrentProducts(
        [...currentProducts].sort((a, b) => {
          const aPrice =
            a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
          const bPrice =
            b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
          return bPrice - aPrice;
        })
      );
    } else {
      setCurrentProducts([...currentProducts].sort((a, b) => a.id - b.id));
    }
  };

  if (loading) {
    return <Loading/>;
  }
/*
  if (error) {
    return <div>Error: {error}</div>;
  }
*/
  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg dark:text-white">Products</span>
            <select
              ref={sortRef}
              className="border border-black dark:border-white rounded p-1 dark:text-white dark:bg-slate-600"
              onChange={(e) => sortProducts(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="asc">Price (low to high)</option>
              <option value="desc">Price (high to low)</option>
            </select>
          </div>
          <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {currentProducts.map((product) => {
              console.log(`Rendering product with ID: ${product.id}`);
              return <ProductCard key={product.id} {...product} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

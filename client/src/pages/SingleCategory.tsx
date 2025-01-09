import { FC, useEffect } from "react";
// For fetching params from URL
import ProductCard from "../components/ProductCard";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchSimilarProducts } from "../redux/features/productSlice";
import Loading from "../components/Loading";
import { Product } from "../models/Product";

interface SingleCategoryProps {
  categoryName: string;
}

const SingleCategory: FC<SingleCategoryProps> = ({ categoryName }) => {
  const dispatch = useAppDispatch();

  const productList = useAppSelector((state) => state.productReducer.similarProducts);
  const loading = useAppSelector((state) => state.productReducer.loading);

  useEffect(() => {
    window.scrollTo(0, 0); // Pomera stranicu na vrh (0, 0)

    dispatch(fetchSimilarProducts( categoryName ));
  }, [categoryName, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="flex items-center space-x-2 text-lg dark:text-white">
        <span>Categories</span>
        <span> {">"} </span>
        <span className="font-bold">{categoryName}</span>
      </div>
      {productList.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No products found for this category.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 my-2">
          {productList?.map((product ) => (
            <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            images={product.images}
            price={product.price}
            rating={product.rating}
            thumbnail={product.thumbnail}
            description={product.description}
            category={product.category}
            discountPercentage={product.discountPercentage}
          />
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleCategory;

import { useAppSelector } from "../redux/hooks";
import ProductList from "./ProductList";

const TrendingProducts = () => {
  const featuredProducts = useAppSelector(
    (state) => state.productReducer.featuredList
  );

  return <ProductList title="Trending Products" products={featuredProducts} />;
};

export default TrendingProducts;

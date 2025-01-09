import { useAppSelector } from "../redux/hooks";
import ProductList from "./ProductList";

const LatestProducts = () => {
  const newProducts = useAppSelector(
    (state) => state.productReducer.newList
  );

  return <ProductList title="New Arrivals" products={newProducts} />;
};

export default LatestProducts;

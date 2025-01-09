import { FC, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import TrendingProducts from "../components/TrendingProducts";
import { useAppDispatch } from "../redux/hooks";
import { fetchHomeProducts } from "../redux/features/productSlice"; // Import the async thunk
import LatestProducts from "../components/LatestProducts";
import Banner from "../components/Banner";
import { useAppSelector } from "../redux/store";
import Loading from "../components/Loading";

const Home: FC = () => {
  const dispatch = useAppDispatch();
  const loading=useAppSelector((state)=>state.productReducer.loading);

  // Dispatch the fetchHomeProducts thunk inside useEffect
  useEffect(() => {
    dispatch(fetchHomeProducts()); // This will fetch and store the products in Redux
  }, [dispatch]);

  if(loading)
  {
    return <Loading/>
  }

  return (
    <div className="dark:bg-slate-800">
      <HeroSection />
      <Features />
      <TrendingProducts />
      <Banner />
      <LatestProducts />
      <br />
    </div>
  );
};

export default Home;

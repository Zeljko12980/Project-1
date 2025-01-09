import { FC } from "react";
import { Product } from "../models/Product";
import RatingStar from "./RatingStar";
import { addCartItem } from "../redux/features/cartSlice"; // Correct import
import { useAppDispatch } from "../redux/hooks";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import PriceSection from "./PriceSection";
import useAuth from "../hooks/useAuth";

const ProductCard: FC<Product> = ({
  id,
  price,
  title,
  category,
  rating,
  discountPercentage,
  thumbnail,
}) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useAuth(); // Assuming `userId` is available in useAuth
  const userId = localStorage.getItem("userId");

  const addCart = () => {
    requireAuth(() => {
      dispatch(
        addCartItem({
          userId: userId!, // Replace with actual cartId
          itemId: id,          // Pass the product id as productId
          quantity: 1,            // Pass the quantity as 1 (or use a state for dynamic quantity)
        })
      );
      toast.success("Item added to cart successfully", {
        duration: 3000,
      });
    });
  };

  return (
    <div className="border border-gray-200 font-lato" data-test="product-card">
      <div className="text-center border-b border-gray-200">
        <Link to={{ pathname: `/product/${id}` }}>
          <img
            src={thumbnail}
            alt={title}
            className="inline-block h-60 transition-transform duration-200 hover:scale-110"
          />
        </Link>
      </div>
      <div className="px-8 pt-4">
        <p className="text-gray-500 text-[14px] font-medium dark:text-white">
          {category}
        </p>
        <Link
          className="font-semibold hover:underline dark:text-white"
          to={{ pathname: `/product/${id}` }}
        >
          {title}
        </Link>
      </div>
      <div className="px-8">
        <RatingStar rating={rating} />
      </div>
      <div className="flex items-center justify-between px-8 pb-4">
        {discountPercentage && (
          <PriceSection discountPercentage={discountPercentage} price={price} />
        )}
        <button
          type="button"
          className="flex items-center space-x-2 hover:bg-blue-500 text-white py-2 px-4 rounded bg-pink-500"
          onClick={addCart}
          data-test="add-cart-btn"
        >
          <AiOutlineShoppingCart />
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
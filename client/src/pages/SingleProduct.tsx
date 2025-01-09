import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCartItem, setCartState } from "../redux/features/cartSlice";
import { fetchProductDetails, fetchSimilarProducts } from "../redux/features/productSlice";
//import { Product } from "../models/Product";
import RatingStar from "../components/RatingStar";
import PriceSection from "../components/PriceSection";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import ProductList from "../components/ProductList";
import Reviews from "../components/Reviews";
import useAuth from "../hooks/useAuth";
import { MdFavoriteBorder } from "react-icons/md";
import Loading from "../components/Loading";
import { addToWishlist } from "../redux/features/wishSlice";

const SingleProduct: FC = () => {
  const dispatch = useAppDispatch();
  const { productID } = useParams();
  const { requireAuth } = useAuth();

  const product = useAppSelector((state) => state.productReducer.product);
  const similarProducts = useAppSelector((state) => state.productReducer.similarProducts);
  const loading = useAppSelector((state) => state.productReducer.loading);
  //const error = useAppSelector((state) => state.productReducer.error);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (productID) {
      window.scrollTo(0, 0); // Pomera stranicu na vrh (0, 0)

      dispatch(fetchProductDetails(productID)); // Fetch the selected product
    }
  }, [dispatch, productID]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchSimilarProducts(product.category)); // Fetch similar products based on category
    }
  }, [dispatch, product]);

  const handleAddToWishlist = (productId) => {
    // Assuming userId comes from Redux state or another context
    const userId1 = localStorage.getItem("userId");
  
    if (userId1 && productId) {
      dispatch(addToWishlist({ userId:userId1, productId }));
    } else {
      console.log("User ID or Product ID is missing");
    }
  };

  const handleShare = () => {
    if (product) {
      const shareData = {
        title: product.title,
        text: `Check out this product: ${product.title}`,
        url: window.location.href,
      };

      if (navigator.share) {
        navigator.share(shareData)
          .then(() => toast.success("Product shared successfully!", { duration: 3000 }))
          .catch((err) => console.error("Error sharing", err));
      } else {
        const encodedURL = encodeURIComponent(window.location.href);
        const encodedText = encodeURIComponent(`Check out this product: ${product.title}`);
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&quote=${encodedText}`,
          "_blank"
        );
      }
    } else {
      toast.error("No product information available to share!", { duration: 3000 });
    }
  };

  const [isShareMenuOpen, setShareMenuOpen] = useState(false);

const handleShareMenuToggle = () => setShareMenuOpen(!isShareMenuOpen);

  const addCart = () => {
    requireAuth(() => {
      if (product)
        dispatch(
          addCartItem({
            userId: userId!,
            itemId: product.id!,
            quantity: 1,
          })
        );
      toast.success("Item added to cart successfully", { duration: 3000 });
    });
  };

  const buyNow = () => {
    requireAuth(() => {
      if (product)
        dispatch(
          addCartItem({
            userId: userId!,
            itemId: product.id!,
            quantity: 1,
          })
        );
      dispatch(setCartState({ isOpen: true }));
    });
  };

  if (loading) {
    return (
<Loading/>

    );
  }

 

  return (
    <div className="container mx-auto pt-8 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 font-karla">
        <div className="space-y-2">
          <img src={product?.thumbnail} alt="selected" className="h-80" />
          <div className="flex space-x-1 items-center">
            {product?.images.map((_img:any) => (
              <img
                src={_img}
                key={_img}
                alt="thumb"
                className={`w-12 cursor-pointer hover:border-2 hover:border-black`}
              />
            ))}
          </div>
        </div>
        <div className="px-2">
          <h2 className="text-2xl">{product?.title}</h2>
          {product?.rating && <RatingStar rating={product?.rating} />}
          <div className="mt-1">
            {product?.discountPercentage && (
              <PriceSection
                discountPercentage={product?.discountPercentage}
                price={product?.price}
              />
            )}
          </div>
          <table className="mt-2">
            <tbody>
              <tr>
                <td className="pr-2 font-bold">Brand</td>
                <td>{product?.brand}</td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Category</td>
                <td>{product?.category}</td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Stock</td>
                <td>{product?.stock}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2">
            <h2 className="font-bold">About the product</h2>
            <p className="leading-5">{product?.description}</p>
          </div>
          <div className="flex flex-wrap items-center mt-4 mb-2 space-x-2">
            <button
              type="button"
              className="flex items-center space-x-1 mb-2 hover:bg-pink-700 text-white p-2 rounded bg-pink-500"
              onClick={addCart}
            >
              <AiOutlineShoppingCart />
              <span>ADD TO CART</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-1 mb-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              onClick={buyNow}
            >
              <FaHandHoldingDollar />
              <span>BUY NOW</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-1 mb-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700"
              onClick={()=>handleAddToWishlist(product?.id)}
            >
              <MdFavoriteBorder />
              <span>ADD TO WISHLIST</span>
            </button>

            <div className="relative">
    <button
      type="button"
      className="text-gray-500 hover:text-gray-700 p-2"
      onClick={handleShareMenuToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-55 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v.01M12 12v.01M12 18v.01"
        />
      </svg>
    </button>
    {isShareMenuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg dark:bg-gray-800">
        <ul>
          <li
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleShare()}
          >
            Share 
          </li>
          
        </ul>
      </div>
    )}
  </div>

          </div>
        </div>
        {product && <Reviews id={product.id} />}
      </div>
      <hr className="mt-4" />
      <ProductList title="Similar Products" products={similarProducts} />
      <br />
    </div>
  );
};

export default SingleProduct;
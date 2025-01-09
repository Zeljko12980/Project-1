import { FC } from "react";
import { CartItem } from "../models/CartItem";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { useAppDispatch } from "../redux/hooks";
import { addCartItem, decreaseCartItemQuantity, removeItemFromCart } from "../redux/features/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import useDiscount from "../hooks/useDiscount";

const CartRow: FC<CartItem> = ({
  cartItemId,
  
  title,
  price,
  quantity,
  thumbnail,
  discountPercentage = 0,
}) => {
  const dispatch = useAppDispatch();
  const result = useDiscount({ price, discount: discountPercentage });
  const userId = localStorage.getItem("userId");

  return (
    <div className="grid grid-cols-7 gap-3 border items-center p-3">
      <img src={thumbnail} alt="thumbnail" className="h-20 col-span-2" />
      <div className="col-span-3">
        <h3 className="font-bold leading-4">{title}</h3>
        <div className="flex space-x-2 items-center">
          <h3 className="font-semibold">${result.toFixed(2)}</h3>
          {discountPercentage !== 0 && (
            <span className="text-xs text-gray-500">-{discountPercentage}%</span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <IoIosRemoveCircleOutline
            className="cursor-pointer hover:opacity-80"
            onClick={() =>
              dispatch(
                decreaseCartItemQuantity({ itemId: cartItemId, userId: userId! })
              )
            }
            data-test="cart-reduce-btn"
          />
          <span data-test="cart-item-quantity">{quantity}</span>
          <IoIosAddCircleOutline
            className="cursor-pointer hover:opacity-80"
            data-test="cart-increase-btn"
            onClick={() =>
              dispatch(
                addCartItem({
                  userId: userId!,
                  itemId: cartItemId,
                  quantity: 1,
                })
              )
            }
          />
        </div>
      </div>
      <div className="font-bold col-span-2 flex items-center justify-between">
        {quantity && (
          <span data-test="cart-item-price">
            ${(result * quantity).toFixed(2)}
          </span>
        )}
        <RiDeleteBin6Line
          className="text-red-500 cursor-pointer text-2xl hover:text-red-600"
          onClick={() =>
            dispatch(removeItemFromCart({ itemId: cartItemId, userId: userId! }))
          }
          data-test="cart-remove-btn"
        />
      </div>
    </div>
  );
};

export default CartRow;

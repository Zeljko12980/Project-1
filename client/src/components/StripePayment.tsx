import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import "../components/style.css";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../redux/features/orderSlice";
import toast from "react-hot-toast";
import Loading from "./Loading";

export default function CustomStripePaymentForm({ totalAmount,orderData }) {
  const stripe = useStripe();
  const elements = useElements();
  const isDarkTheme =useAppSelector((state)=>state.homeReducer.isDarkMode);
  const userDetails=useAppSelector((state)=>state.authReducer.userDetails);
  const navigate=useNavigate();
  const dispatch=useAppDispatch();

  const [name, setName] = useState("");
  //const [email, setEmail] = useState("");
 // const [zip, setZip] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setResult("Stripe has not loaded yet. Please try again later.");
      return;
    }

    setResult("Processing payment...");
    setLoading(true);
    
    try {
      const cardElement = elements.getElement(CardNumberElement);
        const email=userDetails?.email;
        const zip=userDetails?.postalCode;

        

      // Create payment method
      const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name,
          email,
          address: { postal_code: zip },
        },
      });

      if (paymentError) {
        toast.error(`Error creating payment method: ${paymentError.message}`);
        setLoading(false);
        return;
      }

      // Create payment intent
      const { data } = await axios.post(
        "http://localhost:5157/api/Payment/create-payment-intent",
        {
          amount: totalAmount>100? totalAmount:totalAmount+55, // Convert amount to smallest currency unit (e.g., cents for USD)
          currency: "usd", // Adjust currency if needed
        }
      );

      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        toast.error("Error: Missing client secret from the server response.");
        setLoading(false);
        return;
      }

      // Confirm payment with the client secret
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setResult(`Error confirming payment: ${confirmError.message}`);
      } else if (paymentIntent?.status === "succeeded") {
     //   toast.success("Payment successful!");
        setLoading(false);
        orderData.isPaid=true;
        dispatch(createOrder(orderData));
     //   toast.success("Your order has been confirmed", { duration: 3000 });
        navigate('/');
        // Reset form
        cardElement?.clear();
        setName("");
     
      } else {
        toast.error("Payment failed. Please try again.", { duration: 3000 });
        setResult("Payment failed. Please try again.");
      }
    } catch (error) {
      setResult(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  //if(loading) return <Loading/>;

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Payment</h2>

      <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
        <form action="#" className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Full name (as displayed on card)* </label>
              <input type="text" id="full_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green" required 
              value={userDetails?.firstName+" "+userDetails?.lastName}
              onChange={(e)=>{setName(e.target.value)}}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="card-number-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Card number* </label>
              <CardNumberElement
  id="card-number-element"
  options={{
    style: {
      base: {
        color: "rgb(31, 41, 55)", // Matches the text color (dark mode optional)
        fontSize: "16px",
        '::placeholder': {
          color: "rgb(107, 114, 128)", // Matches placeholder text color
        },
      },
      invalid: {
        color: "rgb(220, 38, 38)", // Optional error color
      },
    },
    placeholder: "xxxx-xxxx-xxxx-xxxx", // Matches input placeholder
  }}
  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
/>

            </div>

            <div>
              <label htmlFor="card-expiration-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Card expiration* </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                  <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <CardExpiryElement
  id="card-expiry-element"
  options={{
    style: {
      base: {
        color: "rgb(31, 41, 55)", // Matches text color
        fontSize: "16px",
        '::placeholder': {
          color: "rgb(107, 114, 128)", // Matches placeholder text color
        },
      },
      invalid: {
        color: "rgb(220, 38, 38)", // Optional error color
      },
    },
    placeholder: "12/23", // Matches input placeholder format
  }}
  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
/>

              </div>
            </div>
            <div>
              <label htmlFor="cvv-input" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                CVV*
                <button data-tooltip-target="cvv-desc" data-tooltip-trigger="hover" className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white">
                  <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div id="cvv-desc" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                  The last 3 digits on back of card
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </label>
              <CardCvcElement
  id="card-cvc-element"
  options={{
    style: {
      base: {
        color: "rgb(31, 41, 55)", // Matches text color
        fontSize: "16px", // Matches text size
        '::placeholder': {
          color: "rgb(107, 114, 128)", // Matches placeholder text color
        },
      },
      invalid: {
        color: "rgb(220, 38, 38)", // Optional error color
      },
    },
    placeholder: "•••", // Matches input placeholder
  }}
  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
/>

            </div>
          </div>

          <button
  type="submit"
  onClick={!loading ? handleSubmit : null} // Prevent multiple submissions
  className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 
    ${isDarkTheme ? 'bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800' : 'bg-blue-700 hover:bg-blue-800'}
    ${loading ? 'cursor-not-allowed opacity-50' : ''}`} // Add disabled styles
  disabled={loading} // Disable button during loading
>
  {loading ? (
    <div className="flex items-center">
      <svg
        className="mr-2 h-5 w-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Processing...
    </div>
  ) : (
    "Pay now"
  )}
</button>

        </form>

        <div className="mt-6 grow sm:mt-8 lg:mt-0">
          <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">{totalAmount}</dd>
              </dl>

             
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Shipping</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">  {totalAmount > 100 ? "Free Shipping" : "$55"}</dd>
              </dl>
            </div>

            <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
              <dd className="text-base font-bold text-gray-900 dark:text-white">${totalAmount}</dd>
            </dl>
          </div>

          <div className="mt-6 flex items-center justify-center gap-8">
            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="" />
            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg" alt="" />
            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="" />
            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg" alt="" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 lg:text-left">
        Payment processed by <a href="#" title="" className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Paddle</a> for <a href="#" title="" className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Flowbite LLC</a>
        - United States Of America
      </p>
    </div>
  </div>
</section>
  );
}

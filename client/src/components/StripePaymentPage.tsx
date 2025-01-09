import { useLocation } from "react-router-dom";
import StripePaymentForm from "./StripePayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("");

export default function StripePaymentPage() {
    const location = useLocation();
    const { totalAmount,orderData } = location.state;

  return (
    <div>
      <h2>Complete your payment</h2>
      <Elements stripe={stripePromise}>
        <StripePaymentForm totalAmount={totalAmount} orderData={orderData} />
      </Elements>
    </div>
  );
}

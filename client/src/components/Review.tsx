import { Typography, List, ListItem, ListItemText, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { createOrderWithPatch, setShippingAddress, clearShippingAddress } from '../redux/features/orderSlice';
import { useNavigate } from 'react-router-dom';
import { emptyCart } from '../redux/features/cartSlice';

export default function Review() {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card'); // Default payment method
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate(); // Hook for navigation

    // Retrieve user, address, and cart data from Redux store
    const shippingAddress = useSelector((state: RootState) => state.orderReducer.shippingAddress);
    const cartItemsFromStore = useSelector((state: RootState) => state.cartReducer.cartItems);
    const userId = localStorage.getItem("userId"); // Assuming you have userId in your auth state
    const orderStatus = useSelector((state: RootState) => state.orderReducer.orderStatus);
    const orderError = useSelector((state: RootState) => state.orderReducer.error);

    const products = cartItemsFromStore.map(item => ({
        name: item.title,
        desc: item.description,
        price: item.price,
        image: item.thumbnail // Assuming image URL is available in cartItems
    }));

    // Calculate total price
    const total = products.reduce((acc, product) => acc + product.price, 0);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(event.target.value as 'card' | 'cash');
    };

    const handleCreateOrder = () => {
        if (!shippingAddress) {
            alert('Shipping address is required');
            return;
        }

        const orderData = {
            UserId: Number(userId), // Convert userId to number if needed
            TotalAmount: total,
            ShippingAddress: shippingAddress.address,
            City: shippingAddress.city,
            State: shippingAddress.state,
            PostalCode: shippingAddress.zip,
            Country: shippingAddress.country,
            PaymentMethod: paymentMethod,
            OrderItems: cartItemsFromStore.map(item => ({
                ProductId: item.productId, // Ensure this is correct
                Quantity: item.quantity, // Ensure this is correct
                Price: item.price
            }))
        };

        // Dispatch action to create order with JSON patch
        dispatch(createOrderWithPatch(orderData));
        dispatch(clearShippingAddress());
        dispatch(emptyCart());
        navigate('/');
    };

    useEffect(() => {
        if (orderStatus === 'succeeded') {
            //alert('Order placed successfully');
           ; // Clear address after successful order
           // navigate('/'); // Redirect to home or another page
        } else if (orderStatus === 'failed' && orderError) {
           // alert(Failed to place order: ${orderError});
        }
    }, [orderStatus, orderError, dispatch, navigate]);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            <List disablePadding>
                {products.map((product) => (
                    <ListItem key={product.name} sx={{ py: 1, px: 0, display: 'flex', alignItems: 'center' }}>
                        {/* Display product image */}
                        <Box sx={{ width: 50, height: 50, mr: 2 }}>
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <ListItemText primary={product.name} secondary={product.desc} />
                        <Typography variant="body2">${product.price.toFixed(2)}</Typography>
                    </ListItem>
                ))}
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        ${total.toFixed(2)}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Shipping
                    </Typography>
                    <Typography gutterBottom>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                    <Typography gutterBottom>{shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.state}, {shippingAddress?.zip}, {shippingAddress?.country}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Payment Method
                    </Typography>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Payment Method</FormLabel>
                        <RadioGroup
                            aria-label="payment-method"
                            name="payment-method"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                        >
                            <FormControlLabel value="card" control={<Radio />} label="Card" />
                            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOrder}
                sx={{ mt: 2 }}
                disabled={paymentMethod === "card"}
            >
                Place Order
            </Button>
        </>
    );
}

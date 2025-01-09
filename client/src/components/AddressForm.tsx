import { useFormContext } from 'react-hook-form';
import { TextField, Typography, Grid, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setShippingAddress } from '../redux/features/orderSlice'; // Adjust import path
import { useEffect } from 'react';

export default function AddressForm() {
    const { control, handleSubmit, register, watch } = useFormContext();
    const dispatch = useDispatch();

    // Watch for changes in form fields
    const formValues = watch();

    // Automatically save form values to Redux store whenever they change
    useEffect(() => {
        // Dispatch form data to Redux
        const address = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            address: formValues.address,
            city: formValues.city,
            state: formValues.state,
            zip: formValues.zip,
            country: formValues.country
        };
        dispatch(setShippingAddress(address));
    }, [formValues, dispatch]);

    const onSubmit = (data: any) => {
        // Log form data to check if it's being captured correctly
        console.log('Form data:', data);

        // Dispatch form data to Redux
        const address = {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country
        };
        dispatch(setShippingAddress(address));

        // Proceed to the next step
        // Example: If using a stepper, call a function to go to the next step
        // nextStep(); // You need to implement this function to handle navigation
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" gutterBottom>
                Shipping Address
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="First name"
                        {...register('firstName', { required: 'First name is required' })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Last name"
                        {...register('lastName', { required: 'Last name is required' })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Address"
                        {...register('address', { required: 'Address is required' })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="City"
                        {...register('city', { required: 'City is required' })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="State"
                        {...register('state', { required: 'State is required' })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Zip Code"
                        {...register('zip', { required: 'Zip Code is required' })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Country"
                        {...register('country', { required: 'Country is required' })}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Save
            </Button>
        </form>
    );
}

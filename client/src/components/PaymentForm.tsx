import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "./AppTextInput";

export default function PaymentForm() {
    const { control } = useFormContext();

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <AppTextInput
                        control={control}
                        name="cardName"
                        label="Name on card"
                        rules={{ required: "Name on card is required" }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <AppTextInput
                        control={control}
                        name="cardNumber"
                        label="Card number"
                        rules={{ required: "Card number is required" }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <AppTextInput
                        control={control}
                        name="expDate"
                        label="Expiration date"
                        rules={{ required: "Expiration date is required" }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <AppTextInput
                        control={control}
                        name="cvv"
                        label="CVV"
                        rules={{ required: "CVV is required" }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

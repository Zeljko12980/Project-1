using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController:ControllerBase
    {
         private readonly string _stripeSecretKey = "sk_test_51PuAzcEuj11zx1cQqJssOeNGiTffrHgdeuSAXoycxItQEa2taqTg9UKsF0TVV82AwI64F26kavbS8UkvQA5hT5p8002oZ82hnw"; // Zameni sa tvojim Stripe Secret Key

        public PaymentController()
        {
            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        [HttpPost("create-payment-intent")]
        public IActionResult CreatePaymentIntent([FromBody] PaymentRequest paymentRequest)
        {
            try
            {
                // Kreiranje PaymentIntent-a sa iznosom u centima
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(paymentRequest.Amount * 100), // Amount in cents
                    Currency = paymentRequest.Currency,
                };

                var service = new PaymentIntentService();
                var paymentIntent = service.Create(options);

                return Ok(new { clientSecret = paymentIntent.ClientSecret });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }  // Iznos koji se naplaćuje
        public string Currency { get; set; }  // Valuta (npr. "usd")
    }
 }

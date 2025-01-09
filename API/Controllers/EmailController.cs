using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController:ControllerBase
    {
         private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

  
            [HttpPost("send-passport-pdf")]
        public async Task<IActionResult> SendPassportPdfEmailAsync([FromQuery] int orderId, [FromQuery] string toEmail, [FromQuery] string subject, [FromQuery] string message)
        {
            if ( string.IsNullOrEmpty(toEmail) || string.IsNullOrEmpty(subject) || string.IsNullOrEmpty(message))
            {
                return BadRequest("Invalid input parameters.");
            }

            try
            {
                await _emailService.SendEmailWithPdfAsync(orderId, toEmail, subject, message);
                return Ok("Email with passport PDF sent successfully.");
            }
            catch (Exception ex)
            {
                // Log exception if using a logging framework
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
    }

    public class EmailRequest
{
    public string ToEmail { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
}

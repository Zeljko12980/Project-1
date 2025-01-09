using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class EmailService
    {
        private readonly SmtpSettings _smtpSettings;
    private readonly PdfService _pdfService;

    public EmailService(IOptions<SmtpSettings> smtpSettings, PdfService pdfService)
    {
        _smtpSettings = smtpSettings.Value;
        _pdfService = pdfService;
    }

    public async Task SendEmailWithPdfAsync(int orderId, string toEmail, string subject, string message)
    {
        if (string.IsNullOrEmpty(toEmail))
            throw new ArgumentNullException(nameof(toEmail), "Recipient email address cannot be null or empty.");

        if (string.IsNullOrEmpty(subject))
            throw new ArgumentNullException(nameof(subject), "Email subject cannot be null or empty.");

        if (string.IsNullOrEmpty(message))
            throw new ArgumentNullException(nameof(message), "Email message cannot be null or empty.");

        // Generate the PDF
        byte[] pdfContent;
        try
        {
            pdfContent = await _pdfService.CreatePdf(orderId);
            if (pdfContent == null || pdfContent.Length == 0)
            {
                throw new Exception("Generated PDF content is empty.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"PDF generation error: {ex.Message}");
            throw new Exception("Error generating PDF", ex);
        }
        Console.WriteLine(pdfContent.ToString());

        // Send the email
        try
        {
            var mail = new MailMessage()
            {
                From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                Subject = subject,
                Body = message,
                IsBodyHtml = true // Set to true if your message contains HTML
            };
            mail.To.Add(new MailAddress(toEmail));

            if (pdfContent != null && pdfContent.Length > 0)
            {
                var attachment = new Attachment(new MemoryStream(pdfContent), "Order.pdf", "application/pdf");
                mail.Attachments.Add(attachment);
            }

            using (var smtp = new SmtpClient(_smtpSettings.Server, _smtpSettings.Port))
            {
                smtp.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);
                smtp.EnableSsl = true;

                // Log the configuration before sending
                Console.WriteLine($"SMTP Server: {_smtpSettings.Server}, Port: {_smtpSettings.Port}");
                Console.WriteLine("Sending email...");
                await smtp.SendMailAsync(mail);
                Console.WriteLine("Email sent successfully.");
            }
        }
        catch (SmtpException ex)
        {
            // Log more details
            Console.WriteLine($"SMTP error: {ex.Message}");
            throw new Exception($"SMTP error: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            // General exception logging
            Console.WriteLine($"General error: {ex.Message}");
            throw new Exception($"General error: {ex.Message}", ex);
        }
    }

    }
}
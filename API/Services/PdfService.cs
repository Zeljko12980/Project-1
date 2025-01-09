using System.Text;
using iText.Html2pdf;
using iText.Kernel.Pdf;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class PdfService
    {
         private readonly UserManager<AppUser> _userManager;
         private readonly JStoreContext _context;

    public PdfService(UserManager<AppUser> userManager,JStoreContext context)
    {
        _userManager = userManager;
        _context=context;
    }

    public async Task<byte[]> CreatePdf(int orderId)
{
    var order=await _context.Orders.Include(p=>p.OrderStatus).Include(k=>k.OrderItems).FirstOrDefaultAsync(p=>p.OrderId==orderId);
  
    if (order == null)
    {
        throw new Exception("Order not found");
    }

    // Collect current date
    string todayDate = DateTime.Now.ToString("yyyy-MM-dd");

    // Collect user details
    string customer = order.CustomerName;
    string address = order.ShippingAddress;
    string statusOfDelivery =  order.OrderStatus.StatusName;
    string paid =  order.IsPaid? "Yes":"No";
    // Assuming you have this field in your user model

    // Use StringBuilder to create HTML content
    var htmlBuilder = new StringBuilder();

htmlBuilder.AppendLine(@"<!DOCTYPE html>
<html lang='bs'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Potvrda narudžbe</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; }
        .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff; }
        h1, h2, h3 { text-align: center; color: #333; }
        p { margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 10px; text-align: left; }
        th { background-color: #f4f4f4; }
        .total { font-weight: bold; text-align: right; }
        .product-img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
    </style>
</head>
<body>
    <div class='container'>
       <h1>Potvrda narudžbe</h1>
        <p><strong>Name:</strong> " + customer + @"</p>
        <p><strong>Address:</strong> " + address + @"</p>
        <p><strong>Is Paid:</strong> " + paid + @"</p>
        <p><strong>Status of delivery:</strong> " + statusOfDelivery + @"</p>
        <h2>Detalji narudžbe</h2>");

if (order?.OrderItems?.Any() == true)
{
    htmlBuilder.AppendLine(@"
        <table>
            <thead>
                <tr>
                    <th>Slika</th>
                    <th>Naziv proizvoda</th>
                    <th>Količina</th>
                    <th>Cijena po jedinici</th>
                    <th>Ukupno</th>
                </tr>
            </thead>
            <tbody>");

    foreach (var item in order.OrderItems)
    {
        htmlBuilder.AppendLine($@"
                <tr>
                    <td><img src='{System.Net.WebUtility.HtmlEncode(item.Thumbnail)}' alt='Product Image' class='product-img'></td>
                    <td>{System.Net.WebUtility.HtmlEncode(item.Title)}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.UnitPrice.ToString("F2")}$</td>
                    <td>{(item.Quantity * item.UnitPrice).ToString("F2")}$</td>
                </tr>");
    }

    htmlBuilder.AppendLine($@"
            </tbody>
        </table>
        <h3 class='total'>Ukupan iznos: {order.OrderItems.Sum(i => i.Quantity * i.UnitPrice).ToString("F2")}$</h3>");
}
else
{
    htmlBuilder.AppendLine("<p>Trenutno nema stavki u narudžbi.</p>");
}

htmlBuilder.AppendLine(@"
    </div>
</body>
</html>");



    var htmlContent = htmlBuilder.ToString();

    using (var memoryStream = new MemoryStream())
    {
        using (var pdfWriter = new PdfWriter(memoryStream))
        {
            using (var pdfDocument = new PdfDocument(pdfWriter))
            {
                // Convert HTML to PDF using the memory stream
                HtmlConverter.ConvertToPdf(new MemoryStream(Encoding.UTF8.GetBytes(htmlContent)), pdfDocument);
            }
        }

        return memoryStream.ToArray();
    }
}
    }
}
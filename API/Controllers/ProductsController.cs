using API.Hubs;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly JStoreContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ProductsController(JStoreContext context,IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }


//[HttpGet("pokusaj/{productId}")]
      public async Task NotifyUsersOnStockChange(int productId)
{
   var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
        if (product == null)
            return;

        var usersToNotify = _context.Wishlists
            .Where(w => w.ProductId == productId)
            .Select(w => w.UserId)
            .ToList();

        foreach (var userId in usersToNotify)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = $"Product successfully added: {product.Title}",
                CreatedAt = DateTime.Now,
                IsRead = false
            };

            // Save and broadcast the Notification object
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
        }
}

         [HttpGet("stranica")]
public async Task<ActionResult> GetAllProducts(int pageNumber = 1, int pageSize = 5, string? searchTerm = null)
{
    // Start with the products query
    var query = _context.Products.AsQueryable();

    // Apply search filter if searchTerm is provided
    if (!string.IsNullOrEmpty(searchTerm))
    {
        query = query.Where(p => p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm));
    }

    // Get the filtered and paginated products
    var products = await query
        .Skip((pageNumber - 1) * pageSize) // Skip the products for previous pages
        .Take(pageSize) // Take the products for the current page
        .ToListAsync();

    // Calculate the total number of products after filtering
    var productsLength = await query.CountAsync();

    // Calculate the total number of pages
    decimal totalPages = Math.Ceiling((decimal)productsLength / pageSize);

    // Return the result as an object with all required details
    return Ok(new
    {
        Products = products,
        TotalCount = productsLength,
        TotalPages = totalPages
    });
}


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts(string? searchTerm=null)
        {
             var query = _context.Products.AsQueryable();

    // Apply search filter if searchTerm is provided
    if (!string.IsNullOrEmpty(searchTerm))
    {
        query = query.Where(p => p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm));
    }
            return Ok(await query.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }


[HttpGet("category/{categoryName}")]
public async Task<ActionResult> GetCtaegoryName(string categoryName)
{
    return Ok(await _context.Products.Where(x=>x.Category == categoryName).ToListAsync());
}
         [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Products
            .Select(p => p.Category)
            .Distinct()
            .ToListAsync();

        return Ok(categories);
    }

        [HttpPost]
        public async Task<ActionResult> AddProduct([FromBody] ProductDTO productDTO)
        {
            if (productDTO == null)
            {
                return BadRequest();
            }
            Dimensions dimensions=new Dimensions()
            {
                   Depth=productDTO.Dimensions.Depth,
                   Height=productDTO.Dimensions.Height,
                   Width=productDTO.Dimensions.Width,
            };

            var meta = new Meta
    {
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now,
        Barcode = productDTO.Barcode,
        QrCode = productDTO.QrCode
    };

    // Add new Meta to the database
    _context.Metas.Add(meta);
    await _context.SaveChangesAsync();

            var product = new Product
        {
            Title = productDTO.Title,
            Description = productDTO.Description,
            Category = productDTO.Category,
            Price = (double)productDTO.Price,
            DiscountPercentage = productDTO.DiscountPercentage,
            Stock = productDTO.Stock,
            Tags = productDTO.Tags, // Pretvaranje liste tagova u string
            Brand = productDTO.Brand,
            Sku = productDTO.Sku,
            Weight = productDTO.Weight,
            Dimensions=dimensions,
            WarrantyInformation = productDTO.WarrantyInformation,
            ShippingInformation = productDTO.ShippingInformation,
            AvailabilityStatus = productDTO.AvailabilityStatus,
            ReturnPolicy = productDTO.ReturnPolicy,
            MinimumOrderQuantity = productDTO.MinimumOrderQuantity,
            Images = productDTO.Images, // Sličan pristup za slike
            Thumbnail = productDTO.Thumbnail,
            Meta = meta
             
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

            // No need to manually assign the Id since it's an identity column
          
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

          [HttpPut("{id}/update-quantity")]
    public async Task<IActionResult> UpdateProductQuantity(int id, [FromBody] UpdateProductDto updateProductDto)
    {
      var product = await _context.Products.FindAsync(id);
    if (product == null) return BadRequest();

    if (updateProductDto.Price.HasValue)
        product.Price = updateProductDto.Price.Value;

    if (updateProductDto.Stock.HasValue)
        product.Stock = updateProductDto.Stock.Value;

    if (!string.IsNullOrEmpty(updateProductDto.AvailabilityStatus))
        product.AvailabilityStatus = updateProductDto.AvailabilityStatus;

    if (updateProductDto.DiscountPercentage.HasValue)
        product.DiscountPercentage = updateProductDto.DiscountPercentage.Value;

    if (updateProductDto.Tags != null)
        product.Tags =updateProductDto.Tags;
        _context.Products.Update(product);
        await _context.SaveChangesAsync();

         await NotifyUsersOnStockChange(product.Id);

        return Ok(product);
    }
        

        [HttpDelete]
       // [Authorize(Roles = "Admin")]//
        public async Task<ActionResult> DeleteProduct([FromQuery]int id)
        {
            var products = await _context.Products.ToListAsync();
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);
           
            products.Remove(product!);
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(products);
        }
    }
}

public class ProductDTO
{
  public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public double DiscountPercentage { get; set; }
    public int Stock { get; set; }
    public List<string> Tags { get; set; }
    public string Brand { get; set; }
    public string Sku { get; set; }
    public double Weight { get; set; }
  public Dimensions Dimensions { get; set; } = new Dimensions();    
  public string WarrantyInformation { get; set; }
    public string ShippingInformation { get; set; }
    public string AvailabilityStatus { get; set; }
    public string ReturnPolicy { get; set; }
    public int MinimumOrderQuantity { get; set; }
    public List<string> Images { get; set; }
    public string Thumbnail { get; set; }

      public string Barcode { get; set; }
    public string QrCode { get; set; }
}

public class UpdateProductDto
{
      public double? Price { get; set; }
    public int? Stock { get; set; }
    public string AvailabilityStatus { get; set; }
    public double? DiscountPercentage { get; set; }
    public List<string> Tags { get; set; }
}

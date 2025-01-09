using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishListController: ControllerBase
    {
        private readonly JStoreContext _context;

        public WishListController(JStoreContext context)
        {
            _context=context;
        }


   [HttpPost]
public async Task<IActionResult> AddToWishlist(WishlistRequest request)
{
    // Proverite da li je UserId validan
     // Proveriti da li je proizvod već u wishlist-u
    var existingWishlistItem = await _context.Wishlists
        .FirstOrDefaultAsync(w => w.UserId == request.UserId && w.ProductId == request.ProductId);

     if (existingWishlistItem!=null)
     {
        return Ok();
     }
    // Kreiranje novog Wishlist objekta
    var wishlist = new Wishlist
    {
        UserId = request.UserId,
        ProductId = request.ProductId,
        DateAdded = DateTime.UtcNow
    };

    // Dodajte wishlist u DB
    _context.Wishlists.Add(wishlist);
    await _context.SaveChangesAsync();

    return Ok();
}


[HttpDelete]
public async Task<IActionResult> RemoveFromWishlist(string userId, int productId)
{
    var wishlistItem = await _context.Wishlists
        .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

    if (wishlistItem == null)
    {
        return NotFound("Product not found in wishlist.");
    }

    var product= await _context.Products.FirstOrDefaultAsync(p=>p.Id==productId);

    _context.Wishlists.Remove(wishlistItem);
    await _context.SaveChangesAsync();

    return Ok(product);
}


[HttpGet("{userId}")]
public async Task<IActionResult> GetWishlist(string userId,int pageNumber = 1, int pageSize = 5, string? searchTerm = null)
{
     var query = _context.Wishlists.AsQueryable();

    // Filter by userId
    query = query.Where(w => w.UserId == userId);

    // Apply search filter if searchTerm is provided (search by product title or description)
    if (!string.IsNullOrEmpty(searchTerm))
    {
        query = query.Where(w => w.Product.Title.Contains(searchTerm) || w.Product.Description.Contains(searchTerm));
    }

    // Get the filtered and paginated wishlist products
    var wishlistItems = await query
        .Skip((pageNumber - 1) * pageSize) // Skip the items for previous pages
        .Take(pageSize) // Take the items for the current page
        .Include(w => w.Product) // Include product details
        .ToListAsync();

    // Calculate the total number of wishlist items after filtering
    var wishlistLength = await query.CountAsync();

    // Calculate the total number of pages
    decimal totalPages = Math.Ceiling((decimal)wishlistLength / pageSize);

    // Return the result as an object with all required details
    return Ok(new
    {
        Products = wishlistItems.Select(w => w.Product), // Extract the product details
        TotalCount = wishlistLength,
        TotalPages = totalPages
    });
}





    }

public class WishlistRequest
{
    public string UserId { get; set; }  // obavezno polje
    public int ProductId { get; set; }
}


}
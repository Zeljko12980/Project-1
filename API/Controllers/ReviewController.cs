using API.AutoMapper;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly JStoreContext _context;

        public ReviewController(JStoreContext context)
        {
            _context = context;
        }

        // **Read**: Get all reviews
        [HttpGet]
        public async Task<ActionResult> GetReviews()
        {
            var reviews = await _context.ProductReviews.Include(p=>p.AppUser).Include(p=>p.Product).ToListAsync();
            return Ok(reviews);
        }

        // **Read**: Get a single review by ID
       

        // **Create**: Add a new review
        [HttpPost]
public async Task<ActionResult> CreateReview([FromBody] AddReviewDto review)
{
    // Validacija ulaznih podataka
    if (review == null)
    {
        return BadRequest(new { message = "Review data cannot be null." });
    }

    // Provera korisnika
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == review.UserId.ToString());
    if (user == null)
    {
        return BadRequest(new { message = "User not found." });
    }

    // Provera proizvoda
    var product = await _context.Products
        .Include(p => p.Reviews) // Učitavanje postojećih recenzija proizvoda
        .FirstOrDefaultAsync(p => p.Id == review.ProductId);
    if (product == null)
    {
        return BadRequest(new { message = "Product not found." });
    }

    // Kreiranje nove recenzije
    var reviewNew = new Review
    {
        Comment = review.Comment,
        Date = DateTime.UtcNow, // Koristi UTC vreme za univerzalnu konzistentnost
        ProductId = product.Id,
        Rating = review.Rating,
        ReviewerName = user.UserName,
        ReviewerEmail = user.Email,
        Product = product,
        AppUser = user
    };

    // Dodavanje recenzije u bazu
    _context.ProductReviews.Add(reviewNew);
    await _context.SaveChangesAsync();

    // Ažuriranje prosečne ocene proizvoda
    product.Rating = product.Reviews.Average(r => r.Rating);
    _context.Products.Update(product);
    await _context.SaveChangesAsync();

    // Povratna informacija
    return Ok();
}

        // **Update**: Update an existing review
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReview(int id, [FromBody] Review review)
        {
            // Check if the review exists
            var existingReview = await _context.ProductReviews.FindAsync(id);
            if (existingReview == null)
            {
                return NotFound();  // If review not found, return 404
            }

            // Update the properties of the existing review
            existingReview.Rating = review.Rating;
            existingReview.Comment = review.Comment;
          existingReview.ProductId = review.ProductId;  // If you want to update the product association

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return NoContent();  // Return 204 No Content for a successful update
        }

        // **Delete**: Delete a review by ID
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var review = await _context.ProductReviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();  // If review not found, return 404
            }

            // Remove the review from the context and save changes
            _context.ProductReviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();  // Return 204 No Content for a successful deletion
        }

        [HttpGet("{productId}")]
public async Task<ActionResult> GetReviewsByProductId(int productId)
{
    var reviews = await _context.ProductReviews
                                 .Where(r => r.ProductId == productId) // Filter reviews by productId
                                // .Include(p => p.AppUser)
                                // .Include(p => p.Product)
                                 .ToListAsync();

    if (reviews == null || reviews.Count == 0)
    {
        return NotFound("No reviews found for this product.");
    }

    return Ok(reviews);
}

    }
}

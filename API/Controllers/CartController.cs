using System.Security.Claims;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly JStoreContext _context;

    public CartController(JStoreContext context)
    {
        _context = context;
    }

    // POST: Get cart by userId, productId, and quantity in body
    [HttpPost("GetCart")]
//    [Authorize]
 // [Authorize(Roles="User")]
    public async Task<IActionResult> GetCart([FromBody] CartRequestModel request)
    {
        
       

        var userId = request.UserId;
        if (string.IsNullOrEmpty(userId.ToString()))
        {
            return Unauthorized("User is not authenticated.");
        }

        Guid expectedUserId = new Guid(userId.ToString());
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == expectedUserId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        return Ok(cart);
    }

    // Add item to cart
    [HttpPost("AddToCart")]
    //  [Authorize(Roles="User")]
    public async Task<IActionResult> AddToCart([FromBody] CartItemRequest request)
    {

      
     

        var userId = request.UserId;
        var itemId = request.ItemId;
        var quantity = request.Quantity;

        var cart = await _context.Carts.Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CartItems = new List<CartItem>()
            };
            _context.Carts.Add(cart);
        }

        var item = await _context.Products.FirstOrDefaultAsync(x => x.Id == itemId);
        if (item == null)
        {
            return NotFound("Item not found.");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == itemId);
        if (cartItem != null)
        {
            cartItem.Quantity += quantity;
        }
        else
        {
            cart.CartItems.Add(new CartItem
            {
                CartItemId = itemId,
                Price = (decimal)item.Price,
                Thumbnail = item.Thumbnail,
                DiscountPercentage = item.DiscountPercentage,
                Title = item.Title,
                Quantity = quantity
            });
        }

        // Update totals
        cart.TotalQuantity += quantity;
        cart.Total += (decimal)item.Price * quantity;
        cart.DiscountedTotal = cart.Total;
        cart.TotalProducts = cart.CartItems.Count();

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "An error occurred while updating the cart." });
        }

        return Ok(cart);
    }

    // Update item quantity in cart
    [HttpPost("UpdateCartItem")]
    //  [Authorize(Roles="User")]
    public async Task<IActionResult> UpdateCartItem([FromBody] CartItemRequest request)
    {
      
        var userId = request.UserId;
        var itemId = request.ItemId;
        var quantity = request.Quantity;

        var cart = await _context.Carts.Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == itemId);
        if (cartItem == null)
        {
            return NotFound("Item not found in the cart.");
        }

        var item = await _context.Products.FirstOrDefaultAsync(x => x.Id == itemId);
        if (item == null)
        {
            return NotFound("Item not found.");
        }

        // Update quantity and totals
        cart.TotalQuantity += quantity - cartItem.Quantity;
        cart.Total += (decimal)(quantity - cartItem.Quantity) * (decimal)item.Price;
        cart.DiscountedTotal = cart.Total;

        cartItem.Quantity = quantity;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "An error occurred while updating the cart." });
        }

        return Ok(cart);
    }

    // Remove item from cart
    [HttpPost("RemoveFromCart")]
   //   [Authorize(Roles="User")]
    public async Task<IActionResult> RemoveFromCart([FromBody] CartItemRequest request)
    {
   

        var userId = request.UserId;
        var itemId = request.ItemId;

        var cart = await _context.Carts.Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == itemId);
        if (cartItem == null)
        {
            return NotFound("Item not found in the cart.");
        }

        var item = await _context.Products.FirstOrDefaultAsync(x => x.Id == itemId);
        if (item == null)
        {
            return NotFound("Item not found.");
        }

        // Remove item and update totals
        cart.CartItems.Remove(cartItem);
        cart.TotalQuantity -= cartItem.Quantity;
        cart.Total -= (decimal)cartItem.Quantity * (decimal)item.Price;
        cart.DiscountedTotal = cart.Total;
        cart.TotalProducts = cart.CartItems.Count();

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "An error occurred while updating the cart." });
        }

        return Ok(cart);
    }

    // Decrease quantity of an item in the cart by 1
    [HttpPost("DecreaseCartItemQuantity")]
   // [Authorize(Roles="User")]
    public async Task<IActionResult> DecreaseCartItemQuantity([FromBody] CartItemRequest request)
    {
      

        var userId = request.UserId;
        var itemId = request.ItemId;

        var cart = await _context.Carts.Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == itemId);
        if (cartItem == null)
        {
            return NotFound("Item not found in the cart.");
        }

        // Ensure the quantity is greater than 1 before decreasing
        if (cartItem.Quantity <= 0)
        {
            return BadRequest("Cannot decrease the quantity below 1.");
        }

        var item = await _context.Products.FirstOrDefaultAsync(x => x.Id == itemId);
        if (item == null)
        {
            return NotFound("Item not found.");
        }

        // Decrease quantity and update totals
        cartItem.Quantity -= 1;
        cart.TotalQuantity -= 1;
        cart.Total -= (decimal)item.Price;
        cart.DiscountedTotal = cart.Total;
        if (cartItem.Quantity == 0)
        {
            cart.CartItems.Remove(cartItem);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "An error occurred while updating the cart." });
        }

        return Ok(cart);
    }
}

public class CartRequestModel
{
    public Guid UserId { get; set; }
}

public class CartItemRequest
{
    public Guid UserId { get; set; }
    public int ItemId { get; set; }
    public int Quantity { get; set; }
}

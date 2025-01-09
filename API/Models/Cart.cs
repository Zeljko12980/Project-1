using Microsoft.EntityFrameworkCore;

namespace API.Models
{
   public class Cart
{
    public int Id { get; set; }
    public List<CartItem> CartItems { get; set; } = new();
    public decimal Total { get; set; }
    public decimal DiscountedTotal { get; set; }
    public Guid UserId { get; set; }
    public AppUser User { get; set; }
    public int TotalProducts { get; set; }
    public int TotalQuantity { get; set; }
}

   public class CartItem
{
    public int Id { get; set; }
    public int CartItemId { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Total { get; set; }
    public double DiscountPercentage { get; set; }
    public decimal DiscountedTotal { get; set; }
    public string Thumbnail { get; set; }
    public int CartId { get; set; }
    public Cart Cart { get; set; }
}

}
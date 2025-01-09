namespace API.DTOs
{
    public class CartDto
{
    public int Id { get; set; }
    public List<CartItemDto> CartItems { get; set; }
    public decimal Total { get; set; }
    public decimal DiscountedTotal { get; set; }
    public string UserId { get; set; }
    public int TotalProducts { get; set; }
    public int TotalQuantity { get; set; }
}
}
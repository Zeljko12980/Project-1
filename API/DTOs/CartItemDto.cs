namespace API.DTOs
{
    public class CartItemDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Total { get; set; }
    public decimal DiscountPercentage { get; set; }
    public decimal DiscountedTotal { get; set; }
    public string Thumbnail { get; set; }
}
}
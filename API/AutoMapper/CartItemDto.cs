namespace API.AutoMapper
{
    public class CartItemDto
    {
        public int ProductId { get; set; } // Id proizvoda
        public string Title { get; set; }   
    public int Quantity { get; set; } // Količina
    public decimal Price { get; set; } // Cena proizvoda
    }
}
namespace API.AutoMapper
{
    public class CreateOrderDto
    {
      public string CustomerName { get; set; } // Ime kupca
        public string ShippingAddress { get; set; } // Adresa za dostavu
        public DateTime OrderDate { get; set; } // Datum kada je porudžbina napravljena
        public int OrderStatusId { get; set; } // ID statusa porudžbine
        public bool IsPaid { get; set; } // Status plaćanja porudžbine
        public string UserId { get; set; } // ID korisnika koji je napravio porudžbinu
    public List<CartItemDto> CartItems { get; set; } // Stavke iz korpe
    }
}
namespace API.Models
{
    public class Order
    {
          public int OrderId { get; set; }
    public string CustomerName { get; set; }
    public string ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; }
    public int OrderStatusId { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
    public bool IsPaid { get; set; }
    public string UserId { get; set; }
    public AppUser User { get; set; }


    }
}
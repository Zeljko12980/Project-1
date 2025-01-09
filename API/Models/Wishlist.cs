namespace API.Models
{
    public class Wishlist
    {
         public int Id { get; set; }
    
    public int ProductId { get; set; }
    public DateTime DateAdded { get; set; }
   public string UserId { get; set; }
    public AppUser User { get; set; }
    public virtual Product Product { get; set; }
    }
}
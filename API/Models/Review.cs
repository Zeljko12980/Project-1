using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set;}
              public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; }
        public string ReviewerName { get; set; }
        public string ReviewerEmail { get; set; }

         public int ProductId { get; set; }
        
        // Navigation property to Project
        public virtual Product Product { get; set; }

        // Foreign key for User

        public Guid UserId{ get; set; }
        public AppUser AppUser { get; set; }

    }
}
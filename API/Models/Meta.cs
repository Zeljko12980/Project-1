using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Meta
    {
        [Key]
         public int Id { get; set; }
          public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Barcode { get; set; }
        public string QrCode { get; set; }
    }
}
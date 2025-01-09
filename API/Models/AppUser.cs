using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class AppUser:IdentityUser
    {
         public string FirstName { get; set; }
        public string LastName { get; set; }

        // Adresa korisnika
        public string Address { get; set; }
          public string City { get; set; }
            public string PostalCode { get; set; }
              public string State { get; set; }
        
        // Telefonski broj korisnika
        public string PhoneNumber { get; set; }

        // Možete dodati i podatke o korisničkim preferencijama
        //public string PreferredPaymentMethod { get; set; }

        // Sekundarna email adresa
        public string Email { get; set; }
        public DateOnly BirthDaryDate{get;set;}
        public int Age {get;set;}
         public ICollection<Cart> Carts { get; set; }

        // Username je već deo IdentityUser klase
        // Takođe možete koristiti Username kao jedinstveni identifikator ako želite
    

        // Ako želite pratiti korisničke narudžbe
        public ICollection<Order> Orders { get; set; }

        // Ako želite pratiti korisničke recenzije proizvoda
        public ICollection<Review> Reviews { get; set; }

         public ICollection<Wishlist> Wishlists { get; set; } 

          public ICollection<Notification> Notifications { get; set; } 
    }
}

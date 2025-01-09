namespace API.Models
{
    public class Notification
    {
    public int Id { get; set; } // Jedinstveni identifikator obaveštenja
    public string UserId { get; set; } // ID korisnika kojem je obaveštenje upućeno
    public string Message { get; set; } // Sadržaj obaveštenja
    public DateTime CreatedAt { get; set; } // Datum i vreme kada je obaveštenje kreirano
    public bool IsRead { get; set; } // Da li je obaveštenje pročitano (logika za praćenje pročitanih obaveštenja)

    // Ako koristite Entity Framework, možete definisati i navigacione osobine, kao što je korisnik:
     public AppUser User { get; set; } // Navigacija prema korisniku (ako je potrebno)


    }
}
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Protocol;

namespace API.Hubs
{
   public class NotificationHub : Hub
{ 
    private readonly JStoreContext _context;

    public NotificationHub(JStoreContext context)
    {
        _context = context;
    }
/*


    // Metoda koja šalje obaveštenje klijentima
    public async Task SendNotification(string userId, string message)
    {
        // Čuvanje obaveštenja u bazi podataka
        var notification = new Notification
        {
            UserId = userId,
            Message = message,
            CreatedAt = DateTime.Now,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // Slanje obaveštenja svim povezanim klijentima
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }*/

  

    // Ova metoda šalje obaveštenje specifičnom korisniku
     public async Task SendNotification(Notification notification)
    {
        // Save the notification to the database
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // Broadcast the Notification object to all connected clients
        await Clients.All.SendAsync("ReceiveNotification", notification);
    }
    // Kada korisnik disconnectuje, uklanjamo ga iz liste
 


}
}
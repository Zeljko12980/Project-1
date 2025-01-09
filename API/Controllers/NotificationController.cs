using API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController:ControllerBase
    {
          private readonly IHubContext<NotificationHub> _hubContext;
          private readonly JStoreContext _context;

    public NotificationController(IHubContext<NotificationHub> hubContext,JStoreContext context)
    {
        _hubContext = hubContext;
        _context=context;
    }

    [HttpDelete("{notificationId}")]
    public async Task<ActionResult> Delete(int notificationId)
    {
        var notification = await _context.Notifications.FirstOrDefaultAsync(x=>x.Id == notificationId);

        if (notification == null)
        {
            return NotFound();
        }

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();

        return Ok(notification);
    }

        [HttpPut("{notificationId}/mark-as-read")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null)
            {
                return NotFound($"Notification with ID {notificationId} not found.");
            }

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Notification marked as read." });
        }

        // API za označavanje svih korisnikovih notifikacija kao pročitane
        [HttpPut("user/{userId}/mark-all-as-read")]
        public async Task<IActionResult> MarkAllAsRead(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            if (notifications == null || notifications.Count == 0)
            {
                return NotFound("No unread notifications found for the user.");
            }

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "All notifications marked as read." });
        }

    [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetUserNotifications(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId cannot be null or empty.");
            }

            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt) // Opcionalno, sortiranje po datumu kreiranja
                .ToListAsync();

            if (notifications == null || notifications.Count == 0)
            {
                return NotFound($"No notifications found for user with ID {userId}.");
            }

            return Ok(notifications);
        }

    [HttpPost]
    public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
    {
        // Slanje obaveštenja sa servera na SignalR
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", request.Message);
        return Ok();
    }
    }

    public class NotificationRequest
    {
         public string UserId { get; set; }
    public string Message { get; set; }
    }

}
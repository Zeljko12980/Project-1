using API.AutoMapper;
using API.Hubs;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController:ControllerBase
    {
           private readonly JStoreContext _context;
           private IMapper _mapper;
           private readonly IHubContext<NotificationHub> _hubContext;
           private readonly EmailService _emailService;
           private readonly UserManager<AppUser> _userManager;

    public OrderController(UserManager<AppUser> userManager,JStoreContext context,IMapper mapper,IHubContext<NotificationHub> hubContext,EmailService emailService)
    {
        _context = context;
        _mapper=mapper;
        _hubContext=hubContext;
        _emailService=emailService;
        _userManager=userManager;
    }

    [HttpGet]
  //  [Authorize]
    public async Task<IActionResult> GetOrders(int pageNumber = 1, int pageSize = 5, string? searchTerm = null)
    { 
        
            // Dohvaćanje userId-a iz Claims
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var query = _context.Orders
    .Where(x => User.IsInRole("User") ? x.UserId == userId : true)
    .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
    .Include(o => o.User)
    .Include(o => o.OrderStatus)
    .OrderByDescending(o => o.OrderDate)  // Replace 'CreatedDate' with the actual date property of the order
    .AsQueryable();


            
        

         

    // Apply search filter if searchTerm is provided
    if (!string.IsNullOrEmpty(searchTerm))
    {
        query = query.Where(p => p.CustomerName.Contains(searchTerm) || p.ShippingAddress.Contains(searchTerm));
    }

    // Get the filtered and paginated products
    var orders = await query
        .Skip((pageNumber - 1) * pageSize) // Skip the products for previous pages
        .Take(pageSize) // Take the products for the current page
        .ToListAsync();

    // Calculate the total number of products after filtering
    var ordersLength = await query.CountAsync();
      decimal totalPages = Math.Ceiling((decimal)ordersLength / pageSize);
        decimal number=0;
        List<object> lista=new List<object>();

        foreach(var order in orders)
        {
            var orderSummary = new
{
    OrderId = order.OrderId,
    CustomerName = order.CustomerName,
    ShippingAddress = order.ShippingAddress,
    OrderDate = order.OrderDate,
    IsPaid = order.IsPaid,
    OrderStatus=order.OrderStatus.StatusName,
    Items = order.OrderItems.Select(item =>
    {
        var totalPrice = item.Quantity * item.UnitPrice;
        number += totalPrice; // Akumulacija ukupne cene
        return new
        {
            OrderItemId = item.OrderItemId,
            Title = item.Title,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            TotalPrice = totalPrice,
            Thumbnail=item.Thumbnail
        };
    }).ToList(),
    TotalOrderPrice = number // Dodavanje ukupne cene u rezultat
};
lista.Add(orderSummary);
number=0;
        }    
       return Ok(new
    {
        Orders = lista,
        TotalCount = ordersLength,
        TotalPages = totalPages
    });
    }

[HttpPost]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
{
    // Validate the input DTO
    if (dto == null || string.IsNullOrEmpty(dto.UserId))
    {
        return BadRequest("Invalid order data provided.");
    }

    // Fetch the cart with the user information
    var cart = await _context.Carts
        .Include(c => c.User)
        .FirstOrDefaultAsync(c => c.UserId == new Guid(dto.UserId));

    // Check if the cart exists
    if (cart == null)
    {
        return NotFound("Cart not found for the provided user.");
    }
    var user= await _userManager.FindByIdAsync(dto.UserId);
    var email=user?.Email;

    // Map DTO to the Order entity
    var order = new Order{
CustomerName=dto.CustomerName,
IsPaid=dto.IsPaid,
OrderDate=DateTime.Now,
OrderStatusId=dto.OrderStatusId,
ShippingAddress=dto.ShippingAddress,
UserId=dto.UserId,

    };

    // Validate if the mapping was successful
   

    // Initialize the OrderItems collection if null
    order.OrderItems ??= new List<OrderItem>();

    foreach (var itemDto in dto.CartItems)
    {
        var orderItem = _mapper.Map<OrderItem>(itemDto);

        // Fetch the product and validate its existence
        var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == orderItem.ProductId);
        if (product == null)
        {
            return NotFound($"Product with ID {orderItem.ProductId} not found.");
        }

        // Validate stock
        if (product.Stock < orderItem.Quantity)
        {
            return BadRequest($"Insufficient stock for product ID {orderItem.ProductId}.");
        }
        orderItem.UnitPrice-=((decimal)product.DiscountPercentage/100)*orderItem.UnitPrice;
        // Deduct stock and update the product
        orderItem.Thumbnail=product.Thumbnail;
        product.Stock -= orderItem.Quantity;
        _context.Products.Update(product);

        // Add the order item to the order
        order.OrderItems.Add(orderItem);
    }

    // Add the order to the database
    _context.Orders.Add(order);

    // Remove the user's cart
    _context.Carts.Remove(cart);

    // Save changes to the database
    await _context.SaveChangesAsync();

    // Notify users and send email (optional: include exception handling here)
    try
    {
        await NotifyUsersOnOrderCreating(order.UserId, order);

        // Uncomment if email service is set up
        
       
            await _emailService.SendEmailWithPdfAsync(
                order.OrderId, 
                email, 
                "Order Confirmation", 
                "Dear Customer, attached is the PDF confirmation of your order."
            );
        
        
    }
    catch (Exception ex)
    {
        // Log exception (replace with proper logging mechanism)
        Console.WriteLine($"Notification or email sending failed: {ex.Message}");
         throw new Exception($"General error: {ex.Message}", ex);
    }

    return Ok(order);
}


   public async Task NotifyUsersOnOrderCreating(string userId,Order order)
{
   var admins=await _userManager.GetUsersInRoleAsync("Admin");
            var notification = new Notification
            {
                UserId = userId,
                Message = $"Order successfully created: {order.CustomerName}-{order.ShippingAddress}",
                CreatedAt = DateTime.Now,
                IsRead = false
            };

            // Save and broadcast the Notification object
            _context.Notifications.Add(notification);
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);

            foreach(var user in admins)
            {
                 var notification1 = new Notification
            {
                UserId = user.Id,
                Message = $"Order successfully created: {order.CustomerName}-{order.ShippingAddress}",
                CreatedAt = DateTime.Now,
                IsRead = false
            };

            // Save and broadcast the Notification object
            _context.Notifications.Add(notification1);
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification1);
            }
            await _context.SaveChangesAsync();

            
        
}
[HttpDelete("{id}")]
//[Authorize(Roles = "Admin")]
public async Task<ActionResult> DeleteOrder(int id)
{
    // Pronađi order koji treba obrisati
    var order = await _context.Orders.FirstOrDefaultAsync(x => x.OrderId == id);
    
    if (order == null)
    {
        return NotFound("Order not found");
    }

    // Ukloni proizvod iz baze podataka
    _context.Orders.Remove(order);
    await _context.SaveChangesAsync();
    decimal totalOrderPrice=0;
  

    // Vratiti preostale narudžbine
   
        var orderSummary = new
        {
            OrderId = order.OrderId,
            CustomerName = order.CustomerName,
            ShippingAddress = order.ShippingAddress,
            OrderDate = order.OrderDate,
            IsPaid = order.IsPaid,
            OrderStatus = order.OrderStatus.StatusName,
            Items = order.OrderItems.Select(item =>
            {
                var totalPrice = item.Quantity * item.UnitPrice;
                totalOrderPrice += totalPrice; // Akumulacija ukupne cene
                return new
                {
                    OrderItemId = item.OrderItemId,
                    Title = item.Title,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = totalPrice
                };
            }).ToList(),
            TotalOrderPrice = totalOrderPrice // Dodavanje ukupne cene u rezultat
       


        };

    return Ok(order);
}


  [HttpPut("{id}")]
    public async Task<ActionResult> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
    {
     

        
            // Dohvati narudžbu iz baze podataka prema ID-u
            var order = await _context.Orders.FirstOrDefaultAsync(o=>o.OrderId==id);

            if (order == null)
            {
                
                return NotFound();
            }

            // Ažuriraj OrderStatusId i IsPaid
            order.OrderStatusId = request.OrderStatusId;
            order.IsPaid = request.IsPaid;

            // Spremi promjene u bazu podataka
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

         var remainingOrders = await _context.Orders.Include(o => o.OrderItems).Include(i=>i.OrderStatus).ToListAsync();
      decimal totalOrderPrice = 0;
    List<object> lista = new List<object>();

    foreach (var order1 in remainingOrders)
    {
        var orderSummary = new
        {
            OrderId = order1.OrderId,
            CustomerName = order1.CustomerName,
            ShippingAddress = order1.ShippingAddress,
            OrderDate = order1.OrderDate,
            IsPaid = order1.IsPaid,
            OrderStatus = order1.OrderStatus.StatusName,
            Items = order1.OrderItems.Select(item =>
            {
                var totalPrice = item.Quantity * item.UnitPrice;
                totalOrderPrice += totalPrice; // Akumulacija ukupne cene
                return new
                {
                    OrderItemId = item.OrderItemId,
                    Title = item.Title,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = totalPrice
                };
            }).ToList(),
            TotalOrderPrice = totalOrderPrice // Dodavanje ukupne cene u rezultat
        };

        lista.Add(orderSummary);

        // Resetuj totalOrderPrice za sledeću narudžbinu
        totalOrderPrice = 0;
    }

            return Ok(lista);
        
    }

    }

    public class UpdateOrderRequest
{
    public int OrderStatusId { get; set; }
    public bool IsPaid { get; set; }
}
}
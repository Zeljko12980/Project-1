using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    public class JStoreContext : IdentityDbContext<AppUser>
    {
        public JStoreContext(DbContextOptions<JStoreContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Review> ProductReviews { get; set; }
        public DbSet<Image> ProductImages { get; set; }
        public DbSet<Dimensions> ProductDimensions { get; set; }
        public DbSet<Meta> Metas { get; set; }

        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

          public DbSet<Order> Orders { get; set; }
    public DbSet<OrderStatus> OrderStatuses { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
     public DbSet<Wishlist> Wishlists { get; set; }

public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Definisanje primarnog ključa za Dimensions
            modelBuilder.Entity<Dimensions>()
                .HasKey(d => d.Id);

                modelBuilder.Entity<Cart>()
    .HasMany(c => c.CartItems)
    .WithOne(ci => ci.Cart)
    .HasForeignKey(ci => ci.CartId);

    modelBuilder.Entity<CartItem>()
    .Property(ci => ci.Id)
    .ValueGeneratedOnAdd();

   // Specify delete behavior

    // Define the relationship between Review and Product
    modelBuilder.Entity<Review>()
        .HasOne(r => r.Product)
        .WithMany(p => p.Reviews)
        .HasForeignKey(r => r.ProductId)
        .OnDelete(DeleteBehavior.Cascade);

         modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId);

        modelBuilder.Entity<OrderStatus>().HasData(
            new OrderStatus { OrderStatusId = 1, StatusName = "Processing" },
            new OrderStatus { OrderStatusId = 2, StatusName = "Shipped" },
            new OrderStatus { OrderStatusId = 3, StatusName = "Delivered" }
        );

            // Ovdje možete dodati dodatne konfiguracije za druge entitete ili relacije
        }
    }
}

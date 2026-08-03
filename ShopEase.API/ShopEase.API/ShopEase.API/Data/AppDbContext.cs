using Microsoft.EntityFrameworkCore;
using ShopEase.API.Models;

namespace ShopEase.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder mb)
        {
            base.OnModelCreating(mb);

            mb.Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.Property(u => u.Email)
                 .IsRequired().HasMaxLength(200);
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.FullName)
                 .IsRequired().HasMaxLength(100);
                e.Property(u => u.Role).HasMaxLength(20);
            });

            // Category config
            mb.Entity<Category>(e =>
            {
                e.HasKey(c => c.Id);
                e.Property(c => c.Name).IsRequired().HasMaxLength(100);
                e.Property(c => c.Slug).IsRequired().HasMaxLength(100);
                e.HasOne(c => c.Parent)
                 .WithMany(c => c.SubCategories)
                 .HasForeignKey(c => c.ParentId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // Product config
            mb.Entity<Product>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.Name).IsRequired().HasMaxLength(200);
                e.Property(p => p.Price).HasPrecision(18, 2);
                e.Property(p => p.Mrp).HasPrecision(18, 2);
                e.Property(p => p.Weight).HasPrecision(10, 2);
                e.HasOne(p => p.Category)
                 .WithMany(c => c.Products)
                 .HasForeignKey(p => p.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed Categories
            mb.Entity<Category>().HasData(
                new Category
                {
                    Id = 1,
                    Name = "Furniture",
                    Slug = "furniture",
                    Icon = "🪑",
                    SortOrder = 1,
                    IsActive = true,
                    ShowInNav = true
                },
                new Category
                {
                    Id = 2,
                    Name = "Electronics",
                    Slug = "electronics",
                    Icon = "📱",
                    SortOrder = 2,
                    IsActive = true,
                    ShowInNav = true
                },
                new Category
                {
                    Id = 3,
                    Name = "Kitchen",
                    Slug = "kitchen",
                    Icon = "🍳",
                    SortOrder = 3,
                    IsActive = true,
                    ShowInNav = true
                },
                new Category
                {
                    Id = 4,
                    Name = "Clothes",
                    Slug = "clothes",
                    Icon = "👕",
                    SortOrder = 4,
                    IsActive = true,
                    ShowInNav = true
                },
                new Category
                {
                    Id = 5,
                    Name = "Hardware",
                    Slug = "hardware",
                    Icon = "🔧",
                    SortOrder = 5,
                    IsActive = true,
                    ShowInNav = true
                },
                new Category
                {
                    Id = 6,
                    Name = "Sports",
                    Slug = "sports",
                    Icon = "⚽",
                    SortOrder = 6,
                    IsActive = true,
                    ShowInNav = true
                }
            );

            // Seed Products
            mb.Entity<Product>().HasData(
    new Product
    {
        Id = 1,
        Name = "Oak Dining Chair — Premium Solid Wood",
        Description = "Solid oak wood chair with ergonomic backrest.",
        ShortDescription = "Premium oak dining chair",
        SeoTags = "dining chair, wooden chair, oak, solid wood",
        Price = 3599,
        Mrp = 5999,
        Stock = 14,
        Brand = "WoodCraft India",
        Sku = "WC-CH-001",
        Rating = 4.2,
        ReviewCount = 128,
        CategoryId = 1,
        IsFeatured = true,
        ShowInDealsStrip = true,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 2,
        Name = "3-Seater Sofa — Grey Fabric",
        Description = "Comfortable 3-seater sofa in premium grey fabric.",
        ShortDescription = "3 seater grey sofa",
        SeoTags = "sofa, 3 seater, grey, fabric, living room",
        Price = 16999,
        Mrp = 22000,
        Stock = 3,
        Brand = "ComfortPlus",
        Sku = "CP-SF-001",
        Rating = 4.8,
        ReviewCount = 54,
        CategoryId = 1,
        IsFeatured = false,
        ShowInDealsStrip = false,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 3,
        Name = "Sheesham Wood Dining Table (4-seater)",
        Description = "Natural grain sheesham wood dining table.",
        ShortDescription = "Sheesham dining table",
        SeoTags = "dining table, sheesham, wooden table, 4 seater",
        Price = 12500,
        Mrp = 18000,
        Stock = 8,
        Brand = "WoodCraft India",
        Sku = "WC-DT-001",
        Rating = 4.5,
        ReviewCount = 67,
        CategoryId = 1,
        IsFeatured = true,
        ShowInDealsStrip = true,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 4,
        Name = "Smart Speaker — 360 Sound",
        Description = "360 degree sound smart speaker with voice control.",
        ShortDescription = "Smart speaker 360 sound",
        SeoTags = "smart speaker, bluetooth, 360 sound, alexa",
        Price = 1299,
        Mrp = 2499,
        Stock = 25,
        Brand = "SoundMax",
        Sku = "SM-SP-001",
        Rating = 4.6,
        ReviewCount = 342,
        CategoryId = 2,
        IsFeatured = true,
        ShowInDealsStrip = true,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 5,
        Name = "Non-stick Pan Set — 3 Piece",
        Description = "3 piece non stick pan set for daily cooking.",
        ShortDescription = "Non stick pan set",
        SeoTags = "pan, non stick, cookware, kitchen, set",
        Price = 799,
        Mrp = 1499,
        Stock = 30,
        Brand = "KitchenPro",
        Sku = "KP-PAN-001",
        Rating = 4.3,
        ReviewCount = 211,
        CategoryId = 3,
        IsFeatured = false,
        ShowInDealsStrip = true,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 6,
        Name = "Study Table — Walnut Finish",
        Description = "Walnut finish study table with storage drawer.",
        ShortDescription = "Walnut study table",
        SeoTags = "study table, walnut, desk, wooden table",
        Price = 6800,
        Mrp = 9999,
        Stock = 12,
        Brand = "WoodCraft India",
        Sku = "WC-ST-001",
        Rating = 4.7,
        ReviewCount = 91,
        CategoryId = 1,
        IsFeatured = false,
        ShowInDealsStrip = false,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 7,
        Name = "Cotton Kurta — Premium",
        Description = "Premium cotton kurta for daily wear.",
        ShortDescription = "Premium cotton kurta",
        SeoTags = "kurta, cotton, men, ethnic wear, indian",
        Price = 499,
        Mrp = 999,
        Stock = 50,
        Brand = "FabricIndia",
        Sku = "FI-KT-001",
        Rating = 4.1,
        ReviewCount = 87,
        CategoryId = 4,
        IsFeatured = false,
        ShowInDealsStrip = true,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    },
    new Product
    {
        Id = 8,
        Name = "Bookshelf 5-tier — Solid Wood",
        Description = "5 tier solid wood bookshelf for home and office.",
        ShortDescription = "5 tier wooden bookshelf",
        SeoTags = "bookshelf, 5 tier, wooden, storage, shelf",
        Price = 5200,
        Mrp = 7500,
        Stock = 20,
        Brand = "WoodCraft India",
        Sku = "WC-BS-001",
        Rating = 4.4,
        ReviewCount = 76,
        CategoryId = 1,
        IsFeatured = false,
        ShowInDealsStrip = false,
        IncludeInAiSearch = true,
        GstRate = "18",
        LowStockAlert = 5,
        FreeDelivery = true,
        ReturnPolicy = "30-day easy return",
        Colours = "",
        Dimensions = "",
        Material = "",
        HsnCode = "",
        Warranty = "",
        ImageUrls = "",
        Status = "Active",
        Weight = 0,
        DeliveryType = "Standard (3-5 days)",
        ShowInFlashSale = false
    }
);

            mb.Entity<Order>(e =>
            {
                e.HasKey(o => o.Id);
                e.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
                e.Property(o => o.SubTotal).HasPrecision(18, 2);
                e.Property(o => o.Discount).HasPrecision(18, 2);
                e.Property(o => o.Gst).HasPrecision(18, 2);
                e.Property(o => o.TotalAmount).HasPrecision(18, 2);
            });

            mb.Entity<OrderItem>(e =>
            {
                e.HasKey(i => i.Id);
                e.Property(i => i.UnitPrice).HasPrecision(18, 2);
                e.Property(i => i.TotalPrice).HasPrecision(18, 2);
                e.HasOne(i => i.Order)
                 .WithMany(o => o.Items)
                 .HasForeignKey(i => i.OrderId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
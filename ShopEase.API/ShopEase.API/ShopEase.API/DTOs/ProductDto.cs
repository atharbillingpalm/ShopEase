using ShopEase.API.Models;

namespace ShopEase.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string SeoTags { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Mrp { get; set; }
        public int DiscountPercent { get; set; }
        public int Stock { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Colours { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public string Material { get; set; } = string.Empty;
        public bool FreeDelivery { get; set; }
        public string ReturnPolicy { get; set; } = string.Empty;
        public string Warranty { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();
        public string Status { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public bool ShowInFlashSale { get; set; }
        public bool IncludeInAiSearch { get; set; }
        public bool ShowInDealsStrip { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string SeoTags { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Mrp { get; set; }
        public string GstRate { get; set; } = "18";
        public int Stock { get; set; }
        public int LowStockAlert { get; set; } = 5;
        public string Sku { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Colours { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public string Material { get; set; } = string.Empty;
        public bool FreeDelivery { get; set; } = true;
        public string ReturnPolicy { get; set; } = "30-day easy return";
        public string Warranty { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
        public bool IsFeatured { get; set; }
        public bool ShowInFlashSale { get; set; }
        public bool IncludeInAiSearch { get; set; } = true;
        public bool ShowInDealsStrip { get; set; }
        public int CategoryId { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public bool ShowInNav { get; set; }
        public int ProductCount { get; set; }
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public int SortOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public bool ShowInNav { get; set; } = true;
    }

    public class CreateOrderDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerMobile { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PinCode { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string CouponCode { get; set; } = string.Empty;
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string SelectedColour { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerMobile { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PinCode { get; set; } = string.Empty;
        public decimal SubTotal { get; set; }
        public decimal Discount { get; set; }
        public decimal Gst { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string TrackingId { get; set; } = string.Empty;
        public string CouponCode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string SelectedColour { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int UserId { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public class ChatMessageDto
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
        public List<ChatMessageDto> History { get; set; } = new();
    }

    public class ChatResponseDto
    {
        public string Text { get; set; } = string.Empty;
        public List<ProductDto> Products { get; set; } = new();
    }

    public static class ProductExtensions
    {
        public static ProductDto MapToDto(this Product p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            ShortDescription = p.ShortDescription,
            SeoTags = p.SeoTags,
            Price = p.Price,
            Mrp = p.Mrp,
            DiscountPercent = p.Mrp > 0
                        ? (int)(((p.Mrp - p.Price) / p.Mrp) * 100)
                        : 0,
            Stock = p.Stock,
            Sku = p.Sku,
            Brand = p.Brand,
            Colours = p.Colours,
            Dimensions = p.Dimensions,
            Material = p.Material,
            FreeDelivery = p.FreeDelivery,
            ReturnPolicy = p.ReturnPolicy,
            Warranty = p.Warranty,
            ImageUrls = string.IsNullOrEmpty(p.ImageUrls)
                        ? new List<string>()
                        : p.ImageUrls.Split(',')
                                     .Select(x => x.Trim())
                                     .ToList(),
            Status = p.Status,
            IsFeatured = p.IsFeatured,
            ShowInFlashSale = p.ShowInFlashSale,
            IncludeInAiSearch = p.IncludeInAiSearch,
            ShowInDealsStrip = p.ShowInDealsStrip,
            Rating = p.Rating,
            ReviewCount = p.ReviewCount,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? "",
            CreatedAt = p.CreatedAt,
        };
    }
}
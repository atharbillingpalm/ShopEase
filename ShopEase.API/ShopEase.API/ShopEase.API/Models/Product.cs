namespace ShopEase.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string SeoTags { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Mrp { get; set; }
        public string GstRate { get; set; } = string.Empty;
        public int Stock { get; set; }
        public int LowStockAlert { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string HsnCode { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Colours { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public string Material { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public string DeliveryType { get; set; } = string.Empty;
        public bool FreeDelivery { get; set; }
        public string ReturnPolicy { get; set; } = string.Empty;
        public string Warranty { get; set; } = string.Empty;
        public string ImageUrls { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public bool ShowInFlashSale { get; set; }
        public bool IncludeInAiSearch { get; set; }
        public bool ShowInDealsStrip { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
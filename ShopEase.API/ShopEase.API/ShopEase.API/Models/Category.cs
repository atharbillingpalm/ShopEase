namespace ShopEase.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public Category? Parent { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public bool ShowInNav { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Product> Products { get; set; }
            = new List<Product>();
        public ICollection<Category> SubCategories { get; set; }
            = new List<Category>();
    }
}
using Microsoft.SemanticKernel;
using ShopEase.API.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace ShopEase.API.AI
{
    public class ProductSearchPlugin
    {
        private readonly AppDbContext _db;

        public ProductSearchPlugin(AppDbContext db)
        {
            _db = db;
        }

        [KernelFunction("search_products")]
        [Description("Search for products by keyword or name")]
        public async Task<string> SearchProducts(
            [Description("Search keyword")]
            string keyword,
            [Description("Maximum price filter, 0 means no limit")]
            decimal maxPrice = 0)
        {
            var query = _db.Products
                .Include(p => p.Category)
                .Where(p => p.Status == "Active");

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(p =>
                    p.Name.Contains(keyword) ||
                    p.Description.Contains(keyword) ||
                    p.Category.Name.Contains(keyword));

            if (maxPrice > 0)
                query = query.Where(p => p.Price <= maxPrice);

            var products = await query
                .OrderBy(p => p.Price)
                .Take(5)
                .ToListAsync();

            if (!products.Any())
                return $"No products found for '{keyword}'" +
                    (maxPrice > 0
                        ? $" under ₹{maxPrice}"
                        : "") + ".";

            var result = products.Select(p =>
                $"ID:{p.Id}|Name:{p.Name}|Price:₹{p.Price}" +
                $"|Category:{p.Category.Name}" +
                $"|Rating:{p.Rating}|Stock:{p.Stock}");

            return string.Join("\n", result);
        }

        [KernelFunction("get_categories")]
        [Description("Get all available product categories")]
        public async Task<string> GetCategories()
        {
            var categories = await _db.Categories
                .Select(c => c.Name)
                .ToListAsync();

            return "Available categories: " +
                string.Join(", ", categories);
        }

        [KernelFunction("get_products_by_category")]
        [Description("Get products in a specific category")]
        public async Task<string> GetProductsByCategory(
            [Description("Category name")]
            string categoryName,
            [Description("Maximum price, 0 means no limit")]
            decimal maxPrice = 0)
        {
            var query = _db.Products
                .Include(p => p.Category)
                .Where(p => p.Status == "Active" &&
                    p.Category.Name.Contains(categoryName));

            if (maxPrice > 0)
                query = query.Where(p => p.Price <= maxPrice);

            var products = await query
                .OrderByDescending(p => p.Rating)
                .Take(5)
                .ToListAsync();

            if (!products.Any())
                return $"No products found in {categoryName}.";

            var result = products.Select(p =>
                $"ID:{p.Id}|Name:{p.Name}|Price:₹{p.Price}" +
                $"|Rating:{p.Rating}|Stock:{p.Stock}");

            return string.Join("\n", result);
        }
    }
}
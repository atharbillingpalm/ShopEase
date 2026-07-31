using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopEase.API.Data;
using ShopEase.API.DTOs;
using ShopEase.API.Models;

namespace ShopEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        // GET api/products
        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetAll(
            [FromQuery] string? category,
            [FromQuery] string? search,
            [FromQuery] string? sort,
            [FromQuery] decimal? maxPrice,
            [FromQuery] bool? featured,
            [FromQuery] bool? dealsOnly)
        {
            var query = _db.Products
                .Include(p => p.Category)
                .Where(p => p.Status == "Active")
                .AsQueryable();

            if (!string.IsNullOrEmpty(category) && category != "All")
                query = query.Where(p =>
                    p.Category!.Name == category ||
                    p.Category!.Slug == category);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Description.Contains(search) ||
                    p.SeoTags.Contains(search) ||
                    p.Brand.Contains(search));

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (featured == true)
                query = query.Where(p => p.IsFeatured);

            if (dealsOnly == true)
                query = query.Where(p => p.ShowInDealsStrip);

            query = sort switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "rating" => query.OrderByDescending(p => p.Rating),
                "latest" => query.OrderByDescending(p => p.CreatedAt),
                "discount" => query.OrderByDescending(p =>
                    p.Mrp - p.Price),
                _ => query.OrderByDescending(p => p.IsFeatured)
            };

            var products = await query
                .Select(p => MapToDto(p))
                .ToListAsync();

            return Ok(products);
        }

        // GET api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _db.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();
            return Ok(MapToDto(product));
        }

        // POST api/products
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create(
            CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                ShortDescription = dto.ShortDescription,
                SeoTags = dto.SeoTags,
                Price = dto.Price,
                Mrp = dto.Mrp,
                GstRate = dto.GstRate,
                Stock = dto.Stock,
                LowStockAlert = dto.LowStockAlert,
                Sku = dto.Sku,
                Brand = dto.Brand,
                Colours = dto.Colours,
                Dimensions = dto.Dimensions,
                Material = dto.Material,
                FreeDelivery = dto.FreeDelivery,
                ReturnPolicy = dto.ReturnPolicy,
                Warranty = dto.Warranty,
                Status = dto.Status,
                IsFeatured = dto.IsFeatured,
                ShowInFlashSale = dto.ShowInFlashSale,
                IncludeInAiSearch = dto.IncludeInAiSearch,
                ShowInDealsStrip = dto.ShowInDealsStrip,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById),
                new { id = product.Id },
                MapToDto(product));
        }

        // PUT api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id, CreateProductDto dto)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.ShortDescription = dto.ShortDescription;
            product.SeoTags = dto.SeoTags;
            product.Price = dto.Price;
            product.Mrp = dto.Mrp;
            product.Stock = dto.Stock;
            product.CategoryId = dto.CategoryId;
            product.IsFeatured = dto.IsFeatured;
            product.Status = dto.Status;
            product.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // Helper — map entity to DTO
        private static ProductDto MapToDto(Product p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            ShortDescription = p.ShortDescription,
            SeoTags = p.SeoTags,
            Price = p.Price,
            Mrp = p.Mrp,
            DiscountPercent = p.Mrp > 0
                ? (int)Math.Round((p.Mrp - p.Price) / p.Mrp * 100)
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
                : p.ImageUrls.Split(',').ToList(),
            Status = p.Status,
            IsFeatured = p.IsFeatured,
            ShowInFlashSale = p.ShowInFlashSale,
            IncludeInAiSearch = p.IncludeInAiSearch,
            ShowInDealsStrip = p.ShowInDealsStrip,
            Rating = p.Rating,
            ReviewCount = p.ReviewCount,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? string.Empty,
            CreatedAt = p.CreatedAt,
        };
    }
}
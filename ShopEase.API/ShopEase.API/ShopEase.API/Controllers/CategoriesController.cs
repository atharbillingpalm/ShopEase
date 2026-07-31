using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopEase.API.Data;
using ShopEase.API.DTOs;
using ShopEase.API.Models;

namespace ShopEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoriesController(AppDbContext db)
        {
            _db = db;
        }

        // GET api/categories
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetAll()
        {
            var cats = await _db.Categories
                .Where(c => c.IsActive)
                .OrderBy(c => c.SortOrder)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    Icon = c.Icon,
                    Description = c.Description,
                    ParentId = c.ParentId,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive,
                    ShowInNav = c.ShowInNav,
                    ProductCount = c.Products.Count(p => p.Status == "Active")
                })
                .ToListAsync();

            return Ok(cats);
        }

        // GET api/categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetById(int id)
        {
            var cat = await _db.Categories
                .Where(c => c.Id == id)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    Icon = c.Icon,
                    Description = c.Description,
                    ParentId = c.ParentId,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive,
                    ShowInNav = c.ShowInNav,
                    ProductCount = c.Products.Count(p => p.Status == "Active")
                })
                .FirstOrDefaultAsync();

            if (cat == null) return NotFound();
            return Ok(cat);
        }

        // POST api/categories
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Create(
            CreateCategoryDto dto)
        {
            var cat = new Category
            {
                Name = dto.Name,
                Slug = dto.Slug,
                Icon = dto.Icon,
                Description = dto.Description,
                ParentId = dto.ParentId,
                SortOrder = dto.SortOrder,
                IsActive = dto.IsActive,
                ShowInNav = dto.ShowInNav,
            };
            _db.Categories.Add(cat);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById),
                new { id = cat.Id },
                new CategoryDto { Id = cat.Id, Name = cat.Name });
        }

        // PUT api/categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id, CreateCategoryDto dto)
        {
            var cat = await _db.Categories.FindAsync(id);
            if (cat == null) return NotFound();

            cat.Name = dto.Name;
            cat.Slug = dto.Slug;
            cat.Icon = dto.Icon;
            cat.Description = dto.Description;
            cat.ParentId = dto.ParentId;
            cat.SortOrder = dto.SortOrder;
            cat.IsActive = dto.IsActive;
            cat.ShowInNav = dto.ShowInNav;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cat = await _db.Categories.FindAsync(id);
            if (cat == null) return NotFound();
            _db.Categories.Remove(cat);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
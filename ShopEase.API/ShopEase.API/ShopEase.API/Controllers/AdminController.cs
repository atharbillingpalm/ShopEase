using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopEase.API.Data;
using ShopEase.API.DTOs;

namespace ShopEase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/admin/orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.CustomerName,
                o.CustomerEmail,
                o.CustomerMobile,
                o.DeliveryAddress,
                o.City,
                o.State,
                o.PinCode,
                o.SubTotal,
                o.Discount,
                o.Gst,
                o.TotalAmount,
                o.PaymentMethod,
                o.PaymentStatus,
                o.Status,
                o.TrackingId,
                o.CreatedAt,
                ItemCount = o.Items.Count,
                Items = o.Items.Select(i => new
                {
                    i.ProductId,
                    i.ProductName,
                    i.Quantity,
                    i.UnitPrice,
                    i.TotalPrice,
                    i.SelectedColour
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    // PATCH /api/admin/orders/{id}/status
    [HttpPatch("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = "Order not found" });

        var validStatuses = new[]
        {
            "Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"
        };

        if (!validStatuses.Contains(dto.Status))
            return BadRequest(new { message = "Invalid status" });

        order.Status = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Order status updated",
            orderId = id,
            status = dto.Status
        });
    }

    // GET /api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.Mobile,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET /api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new
        {
            TotalOrders = await _db.Orders.CountAsync(),
            PendingOrders = await _db.Orders
                                .CountAsync(o => o.Status == "Placed"),
            TotalProducts = await _db.Products.CountAsync(),
            TotalUsers = await _db.Users.CountAsync(),
            TotalRevenue = await _db.Orders
                                .Where(o => o.Status != "Cancelled")
                                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0
        };

        return Ok(stats);
    }
}
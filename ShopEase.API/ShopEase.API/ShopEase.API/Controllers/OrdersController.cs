using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopEase.API.Data;
using ShopEase.API.DTOs;
using ShopEase.API.Models;

namespace ShopEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrdersController(AppDbContext db)
        {
            _db = db;
        }

        // GET api/orders
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetAll()
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => MapToDto(o))
                .ToListAsync();
            return Ok(orders);
        }

        // GET api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();
            return Ok(MapToDto(order));
        }

        // POST api/orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> Create(
            CreateOrderDto dto)
        {
            // Business logic — calculate totals
            var subTotal = dto.Items.Sum(i =>
                i.UnitPrice * i.Quantity);
            var discount = dto.CouponCode?.ToUpper() == "SHOP10"
                ? Math.Round(subTotal * 0.10m, 2) : 0;
            var gst = Math.Round((subTotal - discount) * 0.18m, 2);
            var total = subTotal - discount + gst;

            var order = new Order
            {
                OrderNumber = $"SE-{DateTime.UtcNow:yyyyMMdd}" +
                                 $"-{Random.Shared.Next(100, 999)}",
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                CustomerMobile = dto.CustomerMobile,
                DeliveryAddress = dto.DeliveryAddress,
                City = dto.City,
                State = dto.State,
                PinCode = dto.PinCode,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Paid",
                Status = "Placed",
                CouponCode = dto.CouponCode ?? string.Empty,
                SubTotal = subTotal,
                Discount = discount,
                Gst = gst,
                TotalAmount = total,
                TrackingId = string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    SelectedColour = i.SelectedColour,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.UnitPrice * i.Quantity,
                }).ToList()
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                new { id = order.Id }, MapToDto(order));
        }

        // PUT api/orders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id, [FromBody] string status)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null) return NotFound();
            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        private static OrderDto MapToDto(Order o) => new()
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            CustomerName = o.CustomerName,
            CustomerEmail = o.CustomerEmail,
            CustomerMobile = o.CustomerMobile,
            DeliveryAddress = o.DeliveryAddress,
            City = o.City,
            State = o.State,
            PinCode = o.PinCode,
            SubTotal = o.SubTotal,
            Discount = o.Discount,
            Gst = o.Gst,
            TotalAmount = o.TotalAmount,
            PaymentMethod = o.PaymentMethod,
            PaymentStatus = o.PaymentStatus,
            Status = o.Status,
            TrackingId = o.TrackingId,
            CouponCode = o.CouponCode,
            CreatedAt = o.CreatedAt,
            Items = o.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                SelectedColour = i.SelectedColour,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice,
            }).ToList()
        };
    }
}
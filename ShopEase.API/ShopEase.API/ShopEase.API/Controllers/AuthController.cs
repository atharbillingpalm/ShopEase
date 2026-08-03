using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ShopEase.API.Data;
using ShopEase.API.DTOs;
using ShopEase.API.Models;

namespace ShopEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(
            AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(
            RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(
                u => u.Email == dto.Email.ToLower().Trim()))
                return BadRequest(
                    "Email already registered. Please login.");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email.ToLower().Trim(),
                PasswordHash = BCrypt.Net.BCrypt
                    .HashPassword(dto.Password),
                Mobile = dto.Mobile,
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(MapToResponse(user, GenerateToken(user)));
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(
            LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(
                u => u.Email == dto.Email.ToLower().Trim());

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(
                    dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            if (!user.IsActive)
                return Unauthorized("Account is disabled.");

            return Ok(MapToResponse(user, GenerateToken(user)));
        }

        // GET api/auth/me
        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<AuthResponseDto>> Me()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)
                    ?.Value ?? "0");
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound();
            return Ok(MapToResponse(user, GenerateToken(user)));
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _config["JwtSettings:SecretKey"]!));
            var creds = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256);
            var exp = DateTime.UtcNow.AddDays(
                int.Parse(
                    _config["JwtSettings:ExpiryDays"] ?? "7"));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,
                    user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: exp,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static AuthResponseDto MapToResponse(
            User user, string token) => new()
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
            };
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using ShopEase.API.Data;
using ShopEase.API.DTOs;
using System.Text.Json;

namespace ShopEase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _db;

    public AIController(IConfiguration configuration, AppDbContext db)
    {
        _configuration = configuration;
        _db = db;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequestDto request)
    {
        try
        {
            var apiKey = _configuration["AISettings:GitHubToken"]!;
            var modelId = _configuration["AISettings:ModelId"]!;
            var endpointUrl = _configuration["AISettings:Endpoint"]!;

            // Force Groq endpoint via HttpClient
            var httpClient = new HttpClient
            {
                BaseAddress = new Uri(endpointUrl.TrimEnd('/') + "/")
            };

            // Build SK kernel (no plugins — plain chat only)
            var builder = Kernel.CreateBuilder();
            builder.AddOpenAIChatCompletion(modelId, apiKey, httpClient: httpClient);
            var kernel = builder.Build();
            var chat = kernel.GetRequiredService<IChatCompletionService>();

            // ── STEP 1: AI extracts search intent as JSON ─────────────────
            var intentHistory = new ChatHistory();
            intentHistory.AddSystemMessage(
                "You extract product search intent from user messages. " +
                "Return ONLY valid JSON, no markdown, no explanation, no code fences. " +
                "Format exactly: {\"keyword\":\"core product term\",\"maxPrice\":0} " +
                "Rules: keyword = the core product (e.g. sofa, laptop, chair). " +
                "maxPrice = number if mentioned, else 0. " +
                "Examples: " +
                "\"Show me sofas\" → {\"keyword\":\"sofa\",\"maxPrice\":0} " +
                "\"Laptops under 50000\" → {\"keyword\":\"laptop\",\"maxPrice\":50000} " +
                "\"I need a chair for home office\" → {\"keyword\":\"chair\",\"maxPrice\":0}");

            intentHistory.AddUserMessage(request.Message ?? "");

            var intentResponse = await chat.GetChatMessageContentAsync(
                intentHistory, kernel: kernel);

            // Parse JSON intent safely
            var intentJson = intentResponse.Content?.Trim() ?? "{}";
            intentJson = System.Text.RegularExpressions.Regex
                .Replace(intentJson, @"```json?|```", "").Trim();

            string keyword = request.Message ?? "";
            decimal maxPrice = 0;

            try
            {
                var intent = JsonSerializer.Deserialize<JsonElement>(intentJson);
                if (intent.TryGetProperty("keyword", out var kw))
                    keyword = kw.GetString() ?? keyword;
                if (intent.TryGetProperty("maxPrice", out var mp) &&
                    mp.ValueKind == JsonValueKind.Number)
                    maxPrice = (decimal)mp.GetDouble();
            }
            catch
            {
                // fallback: use full message as keyword
                keyword = request.Message ?? "";
            }

            // ── STEP 2: Search DB directly ────────────────────────────────
            var query = _db.Products
                .Include(p => p.Category)
                .Where(p => p.Status == "Active");

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(p =>
                    p.Name.Contains(keyword) ||
                    p.Description.Contains(keyword) ||
                    (p.Category != null && p.Category.Name.Contains(keyword)) ||
                    (p.Brand != null && p.Brand.Contains(keyword)));

            if (maxPrice > 0)
                query = query.Where(p => p.Price <= maxPrice);

            var entities = await query
                .OrderByDescending(p => p.Rating)
                .Take(5)
                .ToListAsync();

            var products = entities.Select(p => p.MapToDto()).ToList();

            // ── STEP 3: AI generates friendly response ────────────────────
            var responseHistory = new ChatHistory();
            responseHistory.AddSystemMessage(
                "You are ShopEase AI, a warm and helpful shopping assistant for " +
                "an Indian e-commerce store. Be friendly and concise (2-3 sentences). " +
                "Use ₹ for prices. Never list products — just describe what you found warmly.");

            // Add conversation history for memory
            foreach (var h in request.History ?? new List<ChatMessageDto>())
            {
                if (h.Role == "user") responseHistory.AddUserMessage(h.Content);
                else responseHistory.AddAssistantMessage(h.Content);
            }

            string contextMsg;
            if (products.Any())
            {
                var summary = string.Join(", ",
                    products.Select(p => $"{p.Name} (₹{p.Price})"));
                contextMsg = $"Customer asked: \"{request.Message}\". " +
                             $"I found {products.Count} matching product(s): {summary}. " +
                             "Write a warm 2-sentence reply saying you found results. " +
                             "Do not repeat the prices.";
            }
            else
            {
                contextMsg = $"Customer asked: \"{request.Message}\". " +
                             "No products matched. Apologise briefly and suggest " +
                             "trying different keywords or browsing our categories.";
            }

            responseHistory.AddUserMessage(contextMsg);

            var finalResponse = await chat.GetChatMessageContentAsync(
                responseHistory, kernel: kernel);

            return Ok(new ChatResponseDto
            {
                Text = finalResponse.Content ?? "Here are some results for you!",
                Products = products
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AI Error: {ex.Message}");
            Console.WriteLine($"AI Error Details: {ex.InnerException?.Message}");
            Console.WriteLine($"AI Stack: {ex.StackTrace}");
            return Ok(new ChatResponseDto
            {
                Text = $"ERROR: {ex.Message} | {ex.InnerException?.Message}",
                Products = new List<ProductDto>()
            });
        }
    }
}
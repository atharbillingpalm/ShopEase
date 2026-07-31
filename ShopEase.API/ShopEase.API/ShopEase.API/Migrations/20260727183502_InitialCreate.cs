using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShopEase.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParentId = table.Column<int>(type: "int", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ShowInNav = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_Categories_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShortDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SeoTags = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Mrp = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    GstRate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Stock = table.Column<int>(type: "int", nullable: false),
                    LowStockAlert = table.Column<int>(type: "int", nullable: false),
                    Sku = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HsnCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Colours = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dimensions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Material = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    DeliveryType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FreeDelivery = table.Column<bool>(type: "bit", nullable: false),
                    ReturnPolicy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Warranty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrls = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    ShowInFlashSale = table.Column<bool>(type: "bit", nullable: false),
                    IncludeInAiSearch = table.Column<bool>(type: "bit", nullable: false),
                    ShowInDealsStrip = table.Column<bool>(type: "bit", nullable: false),
                    Rating = table.Column<double>(type: "float", nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Icon", "IsActive", "Name", "ParentId", "ShowInNav", "Slug", "SortOrder" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "🪑", true, "Furniture", null, true, "furniture", 1 },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "📱", true, "Electronics", null, true, "electronics", 2 },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "🍳", true, "Kitchen", null, true, "kitchen", 3 },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "👕", true, "Clothes", null, true, "clothes", 4 },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "🔧", true, "Hardware", null, true, "hardware", 5 },
                    { 6, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "⚽", true, "Sports", null, true, "sports", 6 }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "Colours", "CreatedAt", "DeliveryType", "Description", "Dimensions", "FreeDelivery", "GstRate", "HsnCode", "ImageUrls", "IncludeInAiSearch", "IsFeatured", "LowStockAlert", "Material", "Mrp", "Name", "Price", "Rating", "ReturnPolicy", "ReviewCount", "SeoTags", "ShortDescription", "ShowInDealsStrip", "ShowInFlashSale", "Sku", "Status", "Stock", "UpdatedAt", "Warranty", "Weight" },
                values: new object[,]
                {
                    { 1, "WoodCraft India", 1, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "Solid oak wood chair with ergonomic backrest.", "", true, "18", "", "", true, true, 5, "", 5999m, "Oak Dining Chair — Premium Solid Wood", 3599m, 4.2000000000000002, "30-day easy return", 128, "dining chair, wooden chair, oak, solid wood", "Premium oak dining chair", true, false, "WC-CH-001", "Active", 14, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 2, "ComfortPlus", 1, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "Comfortable 3-seater sofa in premium grey fabric.", "", true, "18", "", "", true, false, 5, "", 22000m, "3-Seater Sofa — Grey Fabric", 16999m, 4.7999999999999998, "30-day easy return", 54, "sofa, 3 seater, grey, fabric, living room", "3 seater grey sofa", false, false, "CP-SF-001", "Active", 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 3, "WoodCraft India", 1, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "Natural grain sheesham wood dining table.", "", true, "18", "", "", true, true, 5, "", 18000m, "Sheesham Wood Dining Table (4-seater)", 12500m, 4.5, "30-day easy return", 67, "dining table, sheesham, wooden table, 4 seater", "Sheesham dining table", true, false, "WC-DT-001", "Active", 8, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 4, "SoundMax", 2, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "360 degree sound smart speaker with voice control.", "", true, "18", "", "", true, true, 5, "", 2499m, "Smart Speaker — 360 Sound", 1299m, 4.5999999999999996, "30-day easy return", 342, "smart speaker, bluetooth, 360 sound, alexa", "Smart speaker 360 sound", true, false, "SM-SP-001", "Active", 25, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 5, "KitchenPro", 3, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "3 piece non stick pan set for daily cooking.", "", true, "18", "", "", true, false, 5, "", 1499m, "Non-stick Pan Set — 3 Piece", 799m, 4.2999999999999998, "30-day easy return", 211, "pan, non stick, cookware, kitchen, set", "Non stick pan set", true, false, "KP-PAN-001", "Active", 30, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 6, "WoodCraft India", 1, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "Walnut finish study table with storage drawer.", "", true, "18", "", "", true, false, 5, "", 9999m, "Study Table — Walnut Finish", 6800m, 4.7000000000000002, "30-day easy return", 91, "study table, walnut, desk, wooden table", "Walnut study table", false, false, "WC-ST-001", "Active", 12, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 7, "FabricIndia", 4, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "Premium cotton kurta for daily wear.", "", true, "18", "", "", true, false, 5, "", 999m, "Cotton Kurta — Premium", 499m, 4.0999999999999996, "30-day easy return", 87, "kurta, cotton, men, ethnic wear, indian", "Premium cotton kurta", true, false, "FI-KT-001", "Active", 50, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m },
                    { 8, "WoodCraft India", 1, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard (3-5 days)", "5 tier solid wood bookshelf for home and office.", "", true, "18", "", "", true, false, 5, "", 7500m, "Bookshelf 5-tier — Solid Wood", 5200m, 4.4000000000000004, "30-day easy return", 76, "bookshelf, 5 tier, wooden, storage, shelf", "5 tier wooden bookshelf", false, false, "WC-BS-001", "Active", 20, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentId",
                table: "Categories",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}

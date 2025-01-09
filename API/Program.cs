global using System.ComponentModel.DataAnnotations;
global using API.Models;
global using API.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using API.utils;
using API;
using AutoMapper;
using API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // Add the custom converter
        options.SerializerSettings.Converters.Add(new CleanJsonConverter());
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore; // Avoid circular references
    });

// Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<JStoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Configure Identity
builder.Services.AddIdentityCore<AppUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<JStoreContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]!))
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyMethod()
              .AllowAnyHeader()
              .WithOrigins("http://localhost:5173", "http://10.0.10.121:5173") // Add your frontend origin here
              .AllowCredentials(); // Allow credentials if needed
    });
});

// Configure SignalR
builder.Services.AddSignalR();

// Add Authorization
builder.Services.AddAuthorization();

// Add custom services
builder.Services.AddScoped<TokenService>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });

    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API Documentation",
        Version = "v1",
        Description = "Documentation for the API endpoints.",
    });
});

// Configure SMTP settings
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

// Register EmailService
builder.Services.AddTransient<EmailService>();
builder.Services.AddScoped<PdfService>();

// Build the app
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS policy
app.UseCors("CorsPolicy");

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Enable Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers and SignalR hubs
app.MapControllers();
app.MapHub<NotificationHub>("/notifications");

// Run the app
app.Run();

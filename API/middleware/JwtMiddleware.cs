using System.IdentityModel.Tokens.Jwt;   // Za JwtSecurityTokenHandler, JwtSecurityToken
using System.Text;                        // Za Encoding
using Microsoft.IdentityModel.Tokens;  
namespace API.middleware
{
    public class JwtMiddleware
    {
        
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out SecurityToken validatedToken);
                

              // context.Items["User"] = "123";
                // Attach user to the context if the token is valid
               
                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == "City").Value;
                context.Items["User"] = userId; 
                
                // You can use this to access the user later
            }
            catch
            {
                // If token is not valid, handle the error
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Unauthorized");
                return;
            }
        }

        await _next(context); // Call the next middleware in the pipeline
    }
    }
}
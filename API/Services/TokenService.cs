
using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;

        public TokenService(IConfiguration config,UserManager<AppUser> userManager)
        {
            _config = config;
            _userManager = userManager;
        }
        public async Task<string> GenerateToken(AppUser user){
        var claims = new List<Claim>
        {
              new Claim(ClaimTypes.NameIdentifier, user.Id),  // Custom claim name without URI
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.GivenName, user.FirstName),
        new Claim(ClaimTypes.Surname, user.LastName),
        new Claim("Adress",user.Address),
        new Claim("City",user.City),
        new Claim("PostalCode",user.PostalCode),
        new Claim("Country",user.State),
        new Claim("PhoneNumber",user.PhoneNumber)
        };
        var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:null,
            audience:null,
            claims,
            expires: DateTime.Now.AddDays(24), 
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    }
}
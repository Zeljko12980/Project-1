
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
      
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AuthController(UserManager<AppUser> userManager,TokenService tokenService)
        {
            
            _userManager = userManager;
            _tokenService=tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult> Login (LoginDTO login){
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user,login.Password)) return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new 
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                Token = await _tokenService.GenerateToken(user),
                UserName = user.UserName!,
                
                Roles = roles.ToList(),
               
                Id =  user.Id
            });

        }
        
       [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult> GetCurrentUser()
        {
            // Proveri da li je identitet korisnika validan
            var userName = User.Identity?.Name;
            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(); // Ako korisnik nije autentifikovan
            }

            // Pokušaj da pronađeš korisnika po korisničkom imenu
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return NotFound(); // Ako korisnik ne postoji
            }

           
            

            return Ok(user); // Vrati uspešan odgovor sa DTO-om
        }


       



    }

    public class LoginDTO
    {
         public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
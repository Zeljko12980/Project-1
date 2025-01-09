using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
       // private readonly IConfiguration _configuration;
        private readonly UserManager<AppUser> _userManager;
       // private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenService _tokenService;

        public AccountController( TokenService tokenService, UserManager<AppUser> userManager,RoleManager<IdentityRole> roleManager)
        {
          //  _configuration = configuration;
            _userManager = userManager;
          //  _signInManager = signInManager;
            _roleManager = roleManager;
            _tokenService=tokenService;
        }





        [HttpPost("register-admin")]
       // [Authorize(Roles="Admin")]
public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
{

   /*   var userName1 = User.Identity?.Name;
            if (string.IsNullOrEmpty(userName1))
            {
                return Unauthorized(); // Ako korisnik nije autentifikovan
            }*/
    // Ensure UserName is valid and assign it to Email if not set
    var userName = model.UserName ?? model.Email; // Use Email if UserName is not provided

    // Ensure the UserName is valid (only letters and digits allowed)
    if (string.IsNullOrEmpty(userName) || !userName.All(char.IsLetterOrDigit))
    {
        return BadRequest(new { errors = new[] { new { code = "InvalidUserName", description = "Username can only contain letters or digits." } } });
    }

    var user = new AppUser 
    { 
        UserName = userName,  // Use the valid UserName
        Email = model.Email, 
        FirstName = model.FirstName, 
        LastName = model.LastName, 
        Address = model.Address, 
        PhoneNumber = model.PhoneNumber,
        Age = model.Age,
        BirthDaryDate = model.BirhtDaty,
        City = model.City,
        PostalCode = model.PostalCode,
        State = model.State
    };

    var result = await _userManager.CreateAsync(user, model.Password);

    if (result.Succeeded)
    {
        // Check if the "Admin" role exists, if not, create it
        var roleExists = await _roleManager.RoleExistsAsync("Admin");
        if (!roleExists)
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole("Admin"));
            if (!roleResult.Succeeded)
            {
                return BadRequest(new { errors = roleResult.Errors });
            }
        }

        // Assign the "Admin" role to the newly created user
        await _userManager.AddToRoleAsync(user, "Admin");

       // await _signInManager.SignInAsync(user, isPersistent: false);
        return Ok(new { message = "Administrator registered successfully" });
    }

    return BadRequest(new { errors = result.Errors });
}

        [HttpPost("login")]
        public async Task<ActionResult> Login ([FromBody]LoginDTO login){
            var user = await _userManager.FindByNameAsync(login.UserName);
            if (user == null || !await _userManager.CheckPasswordAsync(user,login.Password)) return Unauthorized();

        

           var token = await _tokenService.GenerateToken(user);
                return Ok(new { token });
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

         [HttpGet("all-users")]
       [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetUsersWithRolesAsync()
        {
             
          var userName = User.Identity?.Name;
            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(); // Ako korisnik nije autentifikovan
            }
         

            var users = await _userManager.Users.ToListAsync();
            var result = new List<object>();

            foreach (var user in users)
            {
                // Fetch user roles
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Address = user.Address,
                    PhoneNumber = user.PhoneNumber,
                    Age = user.Age,
                    City = user.City,
                    PostalCode = user.PostalCode,
                    State = user.State,
                    Roles = roles,
                    
                });
            }

            return Ok(result);
            

            // Access the user id from middleware
   

    // Your logic here
   // return NotFound();

        }

   [HttpPut("edit/{id}")]
// [Authorize(Roles = "Admin")] // Optional: You can add role-based authorization if needed.
public async Task<IActionResult> EditUser(string id, [FromBody] EditUserModel model)
{
    // Find the user by ID
    var user = await _userManager.FindByIdAsync(id);

    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    // Update user details (excluding Username and Email)
    user.FirstName = model.FirstName ?? user.FirstName;
    user.LastName = model.LastName ?? user.LastName;
    user.Address = model.Address ?? user.Address;
    user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;
    user.Age = model.Age ?? user.Age;
    user.City = model.City ?? user.City;
    user.PostalCode = model.PostalCode ?? user.PostalCode;
    user.State = model.State ?? user.State;

    // Update the user in the database
    var result = await _userManager.UpdateAsync(user);

    if (result.Succeeded)
    {
        return Ok(new { message = "User details updated successfully" });
    }

    return BadRequest(new { errors = result.Errors });
}


        // Delete API endpoint
[HttpDelete("delete/{id}")]
//[Authorize(Roles = "Admin")]  // Only allow admins to delete users
public async Task<IActionResult> DeleteUser(string id)
{
    // Find the user by ID
    var user = await _userManager.FindByIdAsync(id);

    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    // Delete the user
    var result = await _userManager.DeleteAsync(user);

    if (result.Succeeded)
    {
        return Ok(new { message = "User deleted successfully" });
    }

    return BadRequest(new { errors = result.Errors });
}


 [Authorize(Roles = "Admin")]
       

        [HttpPost]
        public async Task<IActionResult> PostAccount()
        {
            var userIdFromClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // If no userId is found, return Unauthorized
            if (userIdFromClaims == null)
            {
                return Unauthorized(new { message = "Invalid or expired token" });
            }

            var user = await _userManager.FindByIdAsync(userIdFromClaims);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userInfo = new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FirstName,
                user.LastName
            };

            return Ok(userInfo);
        }

        // Register API endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userName = model.UserName ?? model.Email;

            if (string.IsNullOrEmpty(userName) || !userName.All(char.IsLetterOrDigit))
            {
                return BadRequest(new { errors = new[] { new { code = "InvalidUserName", description = "Username can only contain letters or digits." } } });
            }

            var user = new AppUser
            {
                UserName = userName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber,
                Age = model.Age,
                BirthDaryDate = model.BirhtDaty,
                City = model.City,
                PostalCode = model.PostalCode,
                State = model.State
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var roleExists = await _roleManager.RoleExistsAsync("User");
                if (!roleExists)
                {
                    var roleResult = await _roleManager.CreateAsync(new IdentityRole("User"));
                    if (!roleResult.Succeeded)
                    {
                        return BadRequest(new { errors = roleResult.Errors });
                    }
                }

                await _userManager.AddToRoleAsync(user, "User");
             //   await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { message = "User registered successfully" });
            }

            return BadRequest(new { errors = result.Errors });
        }

       



    

    public class LoginDTO
    {
        public string UserName { get; set; }
        public  string Password { get; set; }
    }

    
        // Login API endpoint
      

        // Logout API endpoint
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
          //  await _signInManager.SignOutAsync();
            return Ok(new { message = "Logout successful" });
        }

        

    
    }

 public class GoogleLoginRequest
{
    public string TokenId { get; set; }
}



    public class RegisterModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateOnly BirhtDaty { get; set; }
        public int Age { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
    }

public class EditUserModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public int? Age { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
    public string State { get; set; }
}

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}

using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using ProjectManagerAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public AuthController(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            string storedHash = null;
            string userId = null;
            string userName = null;
            bool isAdmin = false;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT id, Name, PasswordHash, isAdmin FROM dbo.Users WHERE Email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", model.Email);
                    await conn.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            userId = reader["Id"].ToString();
                            userName = reader["Name"].ToString();
                            storedHash = reader["PasswordHash"].ToString();
                            isAdmin = (bool)reader["isAdmin"];
                        }
                    }
                }
            }

            if (storedHash == null || !BCrypt.Net.BCrypt.Verify(model.Password, storedHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = GenerateJwtToken(userId, userName, model.Email, isAdmin);

            Response.Cookies.Append("auth", token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            );

            return Ok(new
            {
                message = "Login successful"
            });

        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Delete("auth");

            return Ok(new
            {
                message = "Logged out"
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("invite")]
        public async Task<IActionResult> Invite([FromBody] CreateUserModel model)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            string checkQuery =
                "SELECT COUNT(1) FROM Users WHERE Email = @Email";
            using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
            {
                checkCmd.Parameters.AddWithValue("@Email", model.Email);
                int exists = (int)await checkCmd.ExecuteScalarAsync();
                if (exists > 0)
                {
                    return BadRequest(new
                    {
                        message = "User already exists"
                    });
                }
            }
            string insertQuery = @"
                INSERT INTO Users
                    (Name, Email, PasswordHash, IsAdmin, CreatedAt, IsActive)
                VALUES
                    (@Name, @Email, NULL, @IsAdmin, @CreatedAt, 1)";
            using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
            {
                cmd.Parameters.AddWithValue("@Name", model.Name);
                cmd.Parameters.AddWithValue("@Email", model.Email);
                cmd.Parameters.AddWithValue("@IsAdmin", model.IsAdmin);
                cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                await cmd.ExecuteNonQueryAsync();
            }
            return Ok(new
            {
                message = "Invitation created",
                url = $"http://localhost:5173/invitation/{Uri.EscapeDataString(model.Email)}"
            });
        }

        [HttpGet("invitation/{email}")]
        public async Task<IActionResult> CheckInvitation(string email)
        {
            email = Uri.UnescapeDataString(email);
            using SqlConnection conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            string query = @"
                SELECT Name, Email
                FROM Users
                WHERE Email = @Email
                AND PasswordHash IS NULL";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Email", email);
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                return NotFound(new
                {
                    message = "Invitation not found"
                });
            }
            return Ok(new
            {
                name = reader["Name"].ToString(),
                email = reader["Email"].ToString()
            });
        }

        [HttpPost("activate")]
        public async Task<IActionResult> Activate([FromBody] ActivateAccountModel model)
        {
            string passwordHash =
                BCrypt.Net.BCrypt.HashPassword(model.Password);
            using SqlConnection conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            string query = @"
                UPDATE Users
                SET PasswordHash = @PasswordHash
                WHERE Email = @Email
                AND PasswordHash IS NULL";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue(
                "@PasswordHash",
                passwordHash
            );
            cmd.Parameters.AddWithValue(
                "@Email",
                model.Email
            );
            int rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0)
            {
                return BadRequest(new
                {
                    message = "Invalid invitation"
                });
            }
            return Ok(new
            {
                message = "Account activated"
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            return Ok(new
            {
                id = User.FindFirstValue(ClaimTypes.NameIdentifier),
                name = User.FindFirstValue(ClaimTypes.Name),
                email = User.FindFirstValue(ClaimTypes.Email),
                role = User.FindFirstValue(ClaimTypes.Role)
            });
        }

        public string GenerateJwtToken(string userId, string name, string email, bool isAdmin)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, isAdmin ? "Admin" : "User"),
                new Claim("jti", Guid.NewGuid().ToString())
            };

            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(3),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(token);

            return tokenHandler.WriteToken(securityToken);
        }
    }
}

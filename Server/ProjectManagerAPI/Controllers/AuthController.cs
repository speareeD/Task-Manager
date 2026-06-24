using BCrypt.Net;
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

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT id, Name, PasswordHash FROM dbo.Users WHERE Email = @Email";
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
                        }
                    }
                }
            }

            if (storedHash == null || !BCrypt.Net.BCrypt.Verify(model.Password, storedHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = GenerateJwtToken(userId, userName, model.Email);

            return Ok(new { token = token, message = "Login successful" });

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // TODO: combine salt and password
            string salt = Guid.NewGuid().ToString().Substring(0, 10);
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string checkQuery = "SELECT COUNT(1) FROM dbo.Users WHERE Email = @Email";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@Email", model.Email);
                    await conn.OpenAsync();
                    int userExists = (int)await checkCmd.ExecuteScalarAsync();

                    if (userExists > 0)
                        return BadRequest(new { message = "Email is already registered." });
                }

                string insertQuery = "INSERT INTO dbo.Users (name, email, passwordHash, salt, isAdmin, createdAt, isActive) " +
                    "VALUES (@Name, @Email, @PasswordHash, @Salt, @IsAdmin, @CreatedAt, @IsActive)";
                using (SqlCommand insertCmd = new SqlCommand(insertQuery, conn))
                {
                    insertCmd.Parameters.AddWithValue("@Name", model.Name);
                    insertCmd.Parameters.AddWithValue("@Email", model.Email);
                    insertCmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
                    insertCmd.Parameters.AddWithValue("@Salt", salt);
                    insertCmd.Parameters.AddWithValue("@IsAdmin", false);
                    insertCmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                    insertCmd.Parameters.AddWithValue("@IsActive", true);

                    await insertCmd.ExecuteNonQueryAsync();
                }
            }

            return Ok(new { message = "User registered successfully" });
        }

        public string GenerateJwtToken(string userId, string name, string email)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Email, email),
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

using HotChocolate.Authorization;
using Microsoft.Data.SqlClient;
using ProjectManagerAPI.Services;
using System.Security.Claims;

namespace ProjectManagerAPI.GraphQL;

public class Mutation
{
    private readonly string _connectionString;
    private readonly JwtService _jwt;


    public Mutation(IConfiguration config, JwtService jwt)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
        _jwt = jwt;
    }


    public async Task<LoginResponse?> Login(LoginInput input)
    {
        string? storedHash = null;
        string? userId = null;
        string? userName = null;
        bool isAdmin = false;

        using SqlConnection conn = new(_connectionString);

        string query = """
            SELECT 
                Id,
                Name,
                PasswordHash,
                IsAdmin
            FROM Users
            WHERE Email = @Email
        """;

        using SqlCommand cmd =new(query, conn);
        cmd.Parameters.AddWithValue(
            "@Email",
            input.Email
        );
        
        await conn.OpenAsync();
        
        using SqlDataReader reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            userId = reader["Id"].ToString();
            userName = reader["Name"].ToString();
            storedHash = reader["PasswordHash"].ToString();
            isAdmin = (bool)reader["IsAdmin"];
        }

        if (storedHash == null || !BCrypt.Net.BCrypt.Verify(input.Password, storedHash))
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetMessage("Invalid email or password")
                    .Build()
            );
        }

        string token = _jwt.GenerateToken(userId!, userName!, input.Email, isAdmin);
        return new LoginResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(3),

            User = new UserInfo
            {
                Id = int.Parse(userId!),
                Name = userName!,
                Email = input.Email,
                IsAdmin = isAdmin
            }
        };
    }

    [Authorize(Policy = "IsAdmin")]
    public async Task<InviteResponse> Invite(InviteInput input)
    {
        using SqlConnection conn = new(_connectionString);
        await conn.OpenAsync();

        string checkQuery = """
            SELECT COUNT(1)
            FROM Users
            WHERE Email = @Email
        """;

        using SqlCommand check = new(checkQuery, conn);
        check.Parameters.AddWithValue("@Email", input.Email);

        int exists = (int)await check.ExecuteScalarAsync();
        if (exists > 0)
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetMessage("User already exists")
                    .Build()
            );
        }

        string insertQuery = """
            INSERT INTO Users
            (
                Name,
                Email,
                PasswordHash,
                IsAdmin,
                CreatedAt,
                IsActive
            )
            VALUES
            (
                @Name,
                @Email,
                NULL,
                @IsAdmin,
                @CreatedAt,
                1
            )
        """;

        using SqlCommand cmd = new(insertQuery, conn);

        cmd.Parameters.AddWithValue("@Name", input.Name);
        cmd.Parameters.AddWithValue("@Email", input.Email);
        cmd.Parameters.AddWithValue("@IsAdmin", input.IsAdmin);
        cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
        await cmd.ExecuteNonQueryAsync();

        return new InviteResponse
        {
            Message = "Invitation created",
            Url = $"http://localhost:5173/invitation/{Uri.EscapeDataString(input.Email)}"
        };
    }

    public async Task<LoginResponse> Activate(ActivateInput input)
    {
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(input.Password);

        using SqlConnection conn = new(_connectionString);
        await conn.OpenAsync();

        string query = """
            UPDATE Users
            SET PasswordHash = @PasswordHash
            WHERE Email = @Email
            AND PasswordHash IS NULL
        """;

        using SqlCommand cmd = new(query, conn);
        cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
        cmd.Parameters.AddWithValue("@Email", input.Email);
        int rows = await cmd.ExecuteNonQueryAsync();

        if (rows == 0)
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetMessage("Invalid invitation")
                    .Build()
            );
        }

        string userId;
        string name;
        bool isAdmin;

        string selectQuery = """
            SELECT Id, Name, IsAdmin
            FROM Users
            WHERE Email = @Email
        """;

        using SqlCommand select = new(selectQuery, conn);
        select.Parameters.AddWithValue("@Email", input.Email);

        using SqlDataReader reader = await select.ExecuteReaderAsync();

        await reader.ReadAsync();

        userId = reader["Id"].ToString()!;
        name = reader["Name"].ToString()!;
        isAdmin = (bool)reader["IsAdmin"];

        string token = _jwt.GenerateToken(
            userId,
            name,
            input.Email,
            isAdmin
        );

        return new LoginResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(3),
            User = new UserInfo
            {
                Id = int.Parse(userId),
                Name = name,
                Email = input.Email,
                IsAdmin = isAdmin
            }
        };
    }

    [Authorize(Policy = "IsAdmin")]
    public async Task<bool> DeleteUser(int id, ClaimsPrincipal claims)
    {
        int currentUser = int.Parse(claims.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        if (currentUser == id)
            throw new GraphQLException("You cannot delete yourself.");

        using SqlConnection conn = new(_connectionString);
        await conn.OpenAsync();

        const string sql = """
            DELETE FROM Users
            WHERE Id = @Id
        """;

        using SqlCommand cmd = new(sql, conn);
        cmd.Parameters.AddWithValue("@Id", id);

        return await cmd.ExecuteNonQueryAsync() > 0;
    }
}
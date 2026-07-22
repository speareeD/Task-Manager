using Microsoft.Data.SqlClient;
using ProjectManagerAPI.GraphQL;
using System.Security.Claims;

namespace ProjectManagerAPI.Services;

public class UserService
{
    private readonly string _connectionString;

    public UserService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<List<UserDto>> Users()
    {
        using SqlConnection conn = new(_connectionString);
        await conn.OpenAsync();

        const string sql = """
            SELECT
                Id,
                Name,
                Email,
                IsAdmin
            FROM Users
            ORDER BY Name
        """;

        using SqlCommand cmd = new(sql, conn);
        using SqlDataReader reader = await cmd.ExecuteReaderAsync();
        List<UserDto> users = [];
        while (await reader.ReadAsync())
        {
            users.Add(new UserDto
            {
                Id = (int)reader["Id"],
                Name = reader["Name"].ToString()!,
                Email = reader["Email"].ToString()!,
                IsAdmin = (bool)reader["IsAdmin"]
            });
        }
        return users;
    }

    public async Task<InviteResponse> InviteUser(InviteInput input)
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

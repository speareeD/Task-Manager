using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using System.Security.Claims;

namespace ProjectManagerAPI.GraphQL;

public class Query
{
    private readonly string _connectionString;

    public Query(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<InvitationResponse?> Invitation(string email)
    {
        using SqlConnection conn = new(_connectionString);
        await conn.OpenAsync();

        string query = """
            SELECT
                Name,
                Email
            FROM Users
            WHERE Email = @Email
            AND PasswordHash IS NULL
        """;

        using SqlCommand cmd = new(query, conn);
        cmd.Parameters.AddWithValue("@Email", email);

        using SqlDataReader reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return new InvitationResponse
        {
            Name = reader["Name"].ToString()!,
            Email = reader["Email"].ToString()!
        };
    }

    [Authorize(Policy = "IsAdmin")]
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

    [Authorize(Policy = "IsAdmin")]
    public async Task<AdminStats> AdminStats()
    {
        using SqlConnection conn = new(_connectionString);
        await conn.OpenAsync();

        const string sql = """
            SELECT
                (SELECT COUNT(*) FROM Users) AS Users,
                (SELECT COUNT(*) FROM Project) AS Projects,
                (SELECT COUNT(*) FROM Task) AS Tasks
        """;

        using SqlCommand cmd = new(sql, conn);
        using SqlDataReader reader = await cmd.ExecuteReaderAsync();
        await reader.ReadAsync();
        return new AdminStats
        {
            Users = Convert.ToInt32(reader["Users"]),
            Projects = Convert.ToInt32(reader["Projects"]),
            Tasks = Convert.ToInt32(reader["Tasks"])
        };
    }
}

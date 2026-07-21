using Microsoft.Data.SqlClient;

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
}

public class InvitationResponse
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}
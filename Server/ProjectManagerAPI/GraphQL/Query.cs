using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;

namespace ProjectManagerAPI.GraphQL;

public class Query
{
    private readonly string _connectionString;

    public Query(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
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

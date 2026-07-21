namespace ProjectManagerAPI.GraphQL;

public record LoginInput(
    string Email,
    string Password
);

public record InviteInput(
    string Name,
    string Email,
    bool IsAdmin
);

public record ActivateInput(
    string Email,
    string Password
);

public class LoginResponse
{
    public string Token { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public UserInfo User { get; set; } = null!;
}

public class UserInfo
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public bool IsAdmin { get; set; }
}

public class InviteResponse
{
    public string Message { get; set; } = "";
    public string Url { get; set; } = "";
}

public class MessageResponse
{
    public string Message { get; set; } = "";
}
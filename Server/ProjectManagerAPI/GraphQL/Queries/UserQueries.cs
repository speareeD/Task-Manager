using HotChocolate.Authorization;
using ProjectManagerAPI.Services;

namespace ProjectManagerAPI.GraphQL.Queries;

[ExtendObjectType(typeof(Query))]
public class UserQueries
{
    [Authorize(Policy = "IsAdmin")]
    public Task<List<UserDto>> Users(
        [Service] UserService user)
        => user.Users();
}

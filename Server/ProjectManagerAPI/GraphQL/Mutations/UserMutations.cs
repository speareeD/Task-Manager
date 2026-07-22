using HotChocolate.Authorization;
using ProjectManagerAPI.Services;
using System.Security.Claims;

namespace ProjectManagerAPI.GraphQL.Mutations;

[ExtendObjectType(typeof(Mutation))]
public class UserMutations
{
    [Authorize(Policy = "IsAdmin")]
    public Task<InviteResponse> Invite(
        InviteInput input,
        [Service] UserService user)
        => user.InviteUser(input);

    [Authorize(Policy = "IsAdmin")]
    public Task<bool> DeleteUser(
        int id,
        ClaimsPrincipal claims,
        [Service] UserService user)
        => user.DeleteUser(id, claims);
}

using HotChocolate.Authorization;
using ProjectManagerAPI.Services;

namespace ProjectManagerAPI.GraphQL.Queries;

[ExtendObjectType(typeof(Query))]
public class AuthQueries
{
    public Task<InvitationResponse?> Invitation(
        string email,
        [Service] AuthService auth)
        => auth.Invitation(email);
}

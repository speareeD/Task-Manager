using HotChocolate.Authorization;
using ProjectManagerAPI.Services;

namespace ProjectManagerAPI.GraphQL.Mutations;

[ExtendObjectType(typeof(Mutation))]
public class AuthMutations
{
    public Task<LoginResponse?> Login(
        LoginInput input,
        [Service] AuthService auth)
        => auth.Login(input);

    public Task<LoginResponse> Activate(
        ActivateInput input,
        [Service] AuthService auth)
        => auth.Activate(input);
}

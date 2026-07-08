namespace ProjectManagerAPI.Models
{
    public class CreateUserModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
    }
}

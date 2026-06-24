using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectManagerAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; }
        [JsonPropertyName("name")]
        public string Username { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }

        public string Salt { get; set; }
        [JsonPropertyName("password")]
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }
    }
}

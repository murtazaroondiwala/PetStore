using System.ComponentModel.DataAnnotations;

namespace PetStore.Api.DTOs;

public class ProductDto
{
    [Required] public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public decimal Price { get; set; }
    [Required] public string Category { get; set; } = string.Empty;
}

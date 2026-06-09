using System.ComponentModel.DataAnnotations;

namespace PetStore.Api.DTOs;

public class CartDto
{
    [Required] public List<CartItemDto> Items { get; set; } = new();
    [Required] public decimal GrandTotal { get; set; }
}

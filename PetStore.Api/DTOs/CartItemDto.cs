using System.ComponentModel.DataAnnotations;

namespace PetStore.Api.DTOs;

public class CartItemDto
{
    [Required] public int ProductId { get; set; }
    [Required] public string ProductName { get; set; } = string.Empty;
    [Required] public decimal UnitPrice { get; set; }
    [Required] public int Quantity { get; set; }
    [Required] public decimal Subtotal { get; set; }
}

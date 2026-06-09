using System.ComponentModel.DataAnnotations;

namespace PetStore.Api.DTOs;

public class AddToCartRequest
{
    [Required] public int ProductId { get; set; }
    [Required] public int Quantity { get; set; } = 1;
}

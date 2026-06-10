using System.ComponentModel.DataAnnotations;

namespace PetStore.Api.DTOs;

public class CheckoutDto
{
    [Required] public int Id { get; set; }
    [Required] public int CartId { get; set; }
    [Required] public List<CheckoutItemDto> Items { get; set; } = new();
    [Required] public decimal TotalAmount { get; set; }
    [Required] public DateTime CheckoutDate { get; set; }
}

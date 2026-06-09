namespace PetStore.Api.DTOs;

public class CartDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal GrandTotal { get; set; }
}

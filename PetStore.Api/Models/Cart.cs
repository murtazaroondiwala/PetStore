namespace PetStore.Api.Models;

public class Cart
{
    public List<CartItem> Items { get; set; } = new();
}

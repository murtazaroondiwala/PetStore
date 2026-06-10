namespace PetStore.Api.Models;

public class Checkout
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public List<CheckoutItem> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public DateTime CheckoutDate { get; set; }
}

using PetStore.Api.Models;
using PetStore.Api.Repositories.Interfaces;

namespace PetStore.Api.Repositories;

public class CartRepository : ICartRepository
{
    private readonly Cart _cart = new() { Id = 1 };
    private readonly IProductRepository _productRepository;
    private readonly List<Checkout> _checkouts = new();
    private int _nextCheckoutId = 1;

    public CartRepository(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public Cart GetCart() => _cart;

    public void AddOrUpdateItem(int productId, int quantity)
    {
        
        var existing = _cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (existing is not null)
        {
            existing.Quantity += quantity;
            return;
        }

        var product = _productRepository.GetById(productId)
            ?? throw new KeyNotFoundException($"Product {productId} not found.");

        _cart.Items.Add(new CartItem { ProductId = productId, Product = product, Quantity = quantity });
    }

    public bool RemoveItem(int productId)
    {
        var item = _cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null) return false;
        _cart.Items.Remove(item);
        return true;
    }

    public Checkout Checkout()
    {
        var checkout = new Checkout
        {
            Id = _nextCheckoutId++,
            CartId = _cart.Id,
            Items = _cart.Items.Select(i => new CheckoutItem
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                UnitPrice = i.Product.Price,
                Quantity = i.Quantity,
                Subtotal = i.Product.Price * i.Quantity
            }).ToList(),
            TotalAmount = _cart.Items.Sum(i => i.Product.Price * i.Quantity),
            CheckoutDate = DateTime.UtcNow
        };

        _checkouts.Add(checkout);
        ClearCart();
        return checkout;
    }

    public void ClearCart()
    {
        _cart.Items.Clear();
    }
}

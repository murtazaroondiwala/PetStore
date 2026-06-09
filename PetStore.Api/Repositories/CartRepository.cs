using PetStore.Api.Models;
using PetStore.Api.Repositories.Interfaces;

namespace PetStore.Api.Repositories;

public class CartRepository : ICartRepository
{
    private readonly Cart _cart = new();
    private readonly IProductRepository _productRepository;

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
}

using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;
using PetStore.Api.Tests.Stubs;

namespace PetStore.Api.Tests;

public class CartRepositoryTests
{
    private readonly CartRepository _cartRepo;

    public CartRepositoryTests()
    {
        var productRepo = new InMemoryProductRepository(new[]
        {
            new Product { Id = 1, Name = "Product A", Price = 10.00m, Category = ProductCategory.DryFood },
            new Product { Id = 2, Name = "Product B", Price = 5.50m, Category = ProductCategory.Treats },
        });
        _cartRepo = new CartRepository(productRepo);
    }

    [Fact]
    public void AddOrUpdateItem_NewProduct_AddsItemToCart()
    {
        _cartRepo.AddOrUpdateItem(1, 2);

        var cart = _cartRepo.GetCart();
        Assert.Single(cart.Items);
        Assert.Equal(1, cart.Items[0].ProductId);
        Assert.Equal(2, cart.Items[0].Quantity);
    }

    [Fact]
    public void AddOrUpdateItem_ExistingProduct_IncrementsQuantityWithoutDuplicate()
    {
        _cartRepo.AddOrUpdateItem(1, 2);
        _cartRepo.AddOrUpdateItem(1, 3);

        var cart = _cartRepo.GetCart();
        Assert.Single(cart.Items);
        Assert.Equal(5, cart.Items[0].Quantity);
    }

    [Fact]
    public void AddOrUpdateItem_TwoDifferentProducts_CreatesSeparateItems()
    {
        _cartRepo.AddOrUpdateItem(1, 1);
        _cartRepo.AddOrUpdateItem(2, 1);

        var cart = _cartRepo.GetCart();
        Assert.Equal(2, cart.Items.Count);
    }

    [Fact]
    public void AddOrUpdateItem_UnknownProductId_ThrowsKeyNotFoundException()
    {
        Assert.Throws<KeyNotFoundException>(() => _cartRepo.AddOrUpdateItem(99, 1));
    }

    [Fact]
    public void RemoveItem_ExistingItem_RemovesItAndReturnsTrue()
    {
        _cartRepo.AddOrUpdateItem(1, 1);

        var result = _cartRepo.RemoveItem(1);

        Assert.True(result);
        Assert.Empty(_cartRepo.GetCart().Items);
    }

    [Fact]
    public void RemoveItem_NonExistentItem_ReturnsFalse()
    {
        var result = _cartRepo.RemoveItem(99);

        Assert.False(result);
    }
}

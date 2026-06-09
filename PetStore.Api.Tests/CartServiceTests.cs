using PetStore.Api.DTOs;
using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;
using PetStore.Api.Services;
using PetStore.Api.Tests.Stubs;

namespace PetStore.Api.Tests;

public class CartServiceTests
{
    private readonly CartService _cartService;

    public CartServiceTests()
    {
        var productRepo = new InMemoryProductRepository(new[]
        {
            new Product { Id = 1, Name = "Product A", Price = 10.00m, Category = ProductCategory.DryFood },
            new Product { Id = 2, Name = "Product B", Price = 5.50m, Category = ProductCategory.Treats },
        });
        var cartRepo = new CartRepository(productRepo);
        _cartService = new CartService(cartRepo);
    }

    [Fact]
    public void GetCart_EmptyCart_ReturnsZeroGrandTotal()
    {
        var cart = _cartService.GetCart();

        Assert.Empty(cart.Items);
        Assert.Equal(0m, cart.GrandTotal);
    }

    [Fact]
    public void AddToCart_SingleItem_CalculatesSubtotalCorrectly()
    {
        var cart = _cartService.AddToCart(new AddToCartRequest { ProductId = 1, Quantity = 3 });

        var item = Assert.Single(cart.Items);
        Assert.Equal(30.00m, item.Subtotal);   // 10.00 × 3
        Assert.Equal(30.00m, cart.GrandTotal);
    }

    [Fact]
    public void AddToCart_MultipleDistinctItems_SumsGrandTotalCorrectly()
    {
        _cartService.AddToCart(new AddToCartRequest { ProductId = 1, Quantity = 2 }); // 20.00
        var cart = _cartService.AddToCart(new AddToCartRequest { ProductId = 2, Quantity = 4 }); // 22.00

        Assert.Equal(2, cart.Items.Count);
        Assert.Equal(42.00m, cart.GrandTotal);
    }

    [Fact]
    public void AddToCart_ExistingProduct_MergesAndRecalculatesTotal()
    {
        _cartService.AddToCart(new AddToCartRequest { ProductId = 1, Quantity = 1 }); // 10.00
        var cart = _cartService.AddToCart(new AddToCartRequest { ProductId = 1, Quantity = 2 }); // +20.00

        var item = Assert.Single(cart.Items);
        Assert.Equal(3, item.Quantity);
        Assert.Equal(30.00m, item.Subtotal);
        Assert.Equal(30.00m, cart.GrandTotal);
    }

    [Fact]
    public void AddToCart_UnknownProduct_ThrowsKeyNotFoundException()
    {
        Assert.Throws<KeyNotFoundException>(() =>
            _cartService.AddToCart(new AddToCartRequest { ProductId = 99, Quantity = 1 }));
    }
}

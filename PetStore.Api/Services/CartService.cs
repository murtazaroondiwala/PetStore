using PetStore.Api.DTOs;
using PetStore.Api.Repositories.Interfaces;
using PetStore.Api.Services.Interfaces;

namespace PetStore.Api.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public CartDto GetCart()
    {
        var cart = _cartRepository.GetCart();
        return MapToDto(cart.Items.Select(i => new CartItemDto
        {
            ProductId = i.ProductId,
            ProductName = i.Product.Name,
            UnitPrice = i.Product.Price,
            Quantity = i.Quantity,
            Subtotal = i.Product.Price * i.Quantity
        }).ToList());
    }

    public CartDto AddToCart(AddToCartRequest request)
    {
        _cartRepository.AddOrUpdateItem(request.ProductId, request.Quantity);
        return GetCart();
    }

    public bool RemoveFromCart(int productId)
    {
        return _cartRepository.RemoveItem(productId);
    }

    private static CartDto MapToDto(List<CartItemDto> items) => new()
    {
        Items = items,
        GrandTotal = items.Sum(i => i.Subtotal)
    };
}

using PetStore.Api.DTOs;

namespace PetStore.Api.Services.Interfaces;

public interface ICartService
{
    CartDto GetCart();
    CartDto AddToCart(AddToCartRequest request);
    bool RemoveFromCart(int productId);
}

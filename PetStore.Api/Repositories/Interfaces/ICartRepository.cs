using PetStore.Api.Models;

namespace PetStore.Api.Repositories.Interfaces;

public interface ICartRepository
{
    Cart GetCart();
    void AddOrUpdateItem(int productId, int quantity);
    bool RemoveItem(int productId);
}

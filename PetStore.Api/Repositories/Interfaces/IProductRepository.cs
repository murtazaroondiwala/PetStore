using PetStore.Api.Models;

namespace PetStore.Api.Repositories.Interfaces;

public interface IProductRepository
{
    IEnumerable<Product> GetAll();
    Product? GetById(int id);
}

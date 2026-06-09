using PetStore.Api.Models;
using PetStore.Api.Repositories.Interfaces;

namespace PetStore.Api.Tests.Stubs;

internal class InMemoryProductRepository : IProductRepository
{
    private readonly List<Product> _products;

    public InMemoryProductRepository(IEnumerable<Product> products)
    {
        _products = products.ToList();
    }

    public IEnumerable<Product> GetAll() => _products;
    public Product? GetById(int id) => _products.FirstOrDefault(p => p.Id == id);
}

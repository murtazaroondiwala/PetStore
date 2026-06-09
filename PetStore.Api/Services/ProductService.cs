using PetStore.Api.DTOs;
using PetStore.Api.Repositories.Interfaces;
using PetStore.Api.Services.Interfaces;

namespace PetStore.Api.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public IEnumerable<ProductDto> GetAllProducts()
    {
        return _productRepository.GetAll().Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Category = p.Category.ToString()
        });
    }
}

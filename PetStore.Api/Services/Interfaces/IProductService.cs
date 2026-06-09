using PetStore.Api.DTOs;

namespace PetStore.Api.Services.Interfaces;

public interface IProductService
{
    IEnumerable<ProductDto> GetAllProducts();
}

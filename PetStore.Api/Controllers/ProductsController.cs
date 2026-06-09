using Microsoft.AspNetCore.Mvc;
using PetStore.Api.DTOs;
using PetStore.Api.Services.Interfaces;

namespace PetStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<IEnumerable<ProductDto>>> GetAll()
    {
        return Ok(ApiResponse<IEnumerable<ProductDto>>.Ok(_productService.GetAllProducts()));
    }
}

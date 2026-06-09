using Microsoft.AspNetCore.Mvc;
using PetStore.Api.DTOs;
using PetStore.Api.Services.Interfaces;

namespace PetStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<CartDto>> GetCart()
    {
        return Ok(ApiResponse<CartDto>.Ok(_cartService.GetCart()));
    }

    [HttpPost("items")]
    public ActionResult<ApiResponse<CartDto>> AddItem([FromBody] AddToCartRequest request)
    {
        try
        {
            return Ok(ApiResponse<CartDto>.Ok(_cartService.AddToCart(request)));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<CartDto>.Fail(ex.Message));
        }
    }

    [HttpDelete("items/{productId:int}")]
    public ActionResult<ApiResponse<object>> RemoveItem(int productId)
    {
        var removed = _cartService.RemoveFromCart(productId);
        if (!removed)
            return NotFound(ApiResponse<object>.Fail($"Product {productId} not in cart."));

        return Ok(ApiResponse<object>.Ok(null!));
    }
}

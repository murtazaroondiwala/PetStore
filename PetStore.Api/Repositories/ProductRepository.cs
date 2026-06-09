using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories.Interfaces;

namespace PetStore.Api.Repositories;

public class ProductRepository : IProductRepository
{
    private static readonly List<Product> _products = new()
    {
        new() { Id = 1, Name = "Royal Canin Adult Dry", Price = 45.99m, Category = ProductCategory.DryFood },
        new() { Id = 2, Name = "Hill's Science Diet Kibble", Price = 52.49m, Category = ProductCategory.DryFood },
        new() { Id = 3, Name = "Fancy Feast Classic Pâté", Price = 1.99m, Category = ProductCategory.WetFood },
        new() { Id = 4, Name = "Purina Pro Plan Wet Chicken", Price = 2.49m, Category = ProductCategory.WetFood },
        new() { Id = 5, Name = "Temptations Chicken Treats", Price = 5.99m, Category = ProductCategory.Treats },
        new() { Id = 6, Name = "Zuke's Mini Naturals Dog Treats", Price = 8.49m, Category = ProductCategory.Treats },
        new() { Id = 7, Name = "KONG Classic Chew Toy", Price = 14.99m, Category = ProductCategory.Toys },
        new() { Id = 8, Name = "Feather Wand Cat Toy", Price = 9.99m, Category = ProductCategory.Toys },
        new() { Id = 9, Name = "Frontline Plus Flea Treatment", Price = 38.99m, Category = ProductCategory.Healthcare },
        new() { Id = 10, Name = "Probiotic Digestive Supplement", Price = 22.99m, Category = ProductCategory.Healthcare },
    };

    public IEnumerable<Product> GetAll() => _products;

    public Product? GetById(int id) => _products.FirstOrDefault(p => p.Id == id);
}

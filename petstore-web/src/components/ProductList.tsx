import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "#e53935" }}>{error}</p>;

  return (
    <div>
      <h2 style={styles.heading}>Products</h2>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { marginTop: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
  },
};

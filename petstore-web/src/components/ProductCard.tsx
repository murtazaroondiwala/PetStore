import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product.types';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem, loading } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: string) => {
    const parsed = parseInt(value, 10);
    setQuantity(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div style={styles.card}>
      <div style={styles.category}>{product.category}</div>
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.price}>${product.price.toFixed(2)}</p>
      <div style={styles.actions}>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => handleQuantityChange(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={() => addItem(product.id, quantity)}
          disabled={loading}
          style={styles.button}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    backgroundColor: '#fff',
  },
  category: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: '0.05em',
  },
  name: { margin: 0, fontSize: '1rem', fontWeight: 600 },
  price: { margin: 0, fontSize: '1.1rem', color: '#2e7d32', fontWeight: 500 },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
  input: {
    width: '60px',
    padding: '0.4rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  button: {
    flex: 1,
    padding: '0.4rem 0.75rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

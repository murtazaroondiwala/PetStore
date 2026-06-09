import { CartPanel } from './components/CartPanel';
import { ProductList } from './components/ProductList';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <div style={styles.layout}>
          <header style={styles.header}>
            <h1 style={styles.logo}>🐾 PetStore</h1>
          </header>
          <main style={styles.main}>
            <section style={styles.products}>
              <ProductList />
            </section>
            <aside style={styles.cart}>
              <CartPanel />
            </aside>
          </main>
        </div>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;

const styles: Record<string, React.CSSProperties> = {
  layout: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 2rem',
  },
  logo: { margin: 0, padding: '1rem 0', fontSize: '1.5rem' },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '1.5rem',
    padding: '1.5rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  products: {},
  cart: {},
};

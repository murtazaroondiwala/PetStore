import { useCart } from "../context/CartContext";

export function CartPanel() {
  const { cart, loading, removeItem } = useCart();

  return (
    <div style={styles.panel}>
      <h2 style={styles.heading}>Cart</h2>

      {cart.items.length === 0 ? (
        <p style={styles.empty}>Your cart is empty.</p>
      ) : (
        <>
          <div style={styles.list}>
            {cart.items.map((item) => (
              <div key={item.productId} style={styles.item}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.productName}</span>
                  <span style={styles.itemMeta}>
                    ${item.unitPrice.toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <div style={styles.itemRight}>
                  <span style={styles.subtotal}>
                    ${item.subtotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    disabled={loading}
                    style={styles.remove}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.total}>
            <span>Grand Total</span>
            <span style={styles.totalAmount}>
              ${cart.grandTotal.toFixed(2)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "1.25rem",
    backgroundColor: "#fff",
    position: "sticky",
    top: "1rem",
  },
  heading: { marginTop: 0 },
  empty: { color: "#999", fontStyle: "italic" },
  list: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #f0f0f0",
  },
  itemInfo: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  itemName: { fontWeight: 500, fontSize: "0.95rem" },
  itemMeta: { fontSize: "0.8rem", color: "#888" },
  itemRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  subtotal: { fontWeight: 600, color: "#2e7d32" },
  remove: {
    background: "none",
    border: "none",
    color: "#e53935",
    cursor: "pointer",
    fontSize: "0.85rem",
    padding: "2px 4px",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    paddingTop: "0.75rem",
    borderTop: "2px solid #e0e0e0",
    fontWeight: 600,
    fontSize: "1.05rem",
  },
  totalAmount: { color: "#2e7d32", fontSize: "1.15rem" },
};

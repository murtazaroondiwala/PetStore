import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "error" | "success";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const showError = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast],
  );
  const showSuccess = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast],
  );

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
      <div style={styles.container}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              ...styles.toast,
              ...(toast.type === "error" ? styles.error : styles.success),
            }}
          >
            <span>{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} style={styles.close}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    zIndex: 1000,
  },
  toast: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    minWidth: "260px",
    maxWidth: "380px",
    fontSize: "0.9rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    color: "#fff",
  },
  error: { backgroundColor: "#e53935" },
  success: { backgroundColor: "#43a047" },
  close: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
    padding: 0,
  },
};

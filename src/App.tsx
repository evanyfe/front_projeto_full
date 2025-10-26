import { ProductsSection } from './modules/products/ProductsSection';
import { SuppliersSection } from './modules/suppliers/SuppliersSection';
import { API_BASE_URL } from './services/api';
import { LinkSection } from './modules/link/LinkSection';

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="brand">Conecta Compras</div>
          <div className="muted">API base: <code className="kbd">{API_BASE_URL}</code></div>
        </div>
        <div className="badge">v0.1 • preview</div>
      </header>
      <div className="grid grid-2">
        <ProductsSection />
        <SuppliersSection />
      </div>

      <div style={{ marginTop: 24 }}>
        <LinkSection />
      </div>
    </div>
  );
}
